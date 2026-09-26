const crypto = require("crypto");
const db = require("../config/database");

db.exec(`
	CREATE TABLE IF NOT EXISTS sessions (
		token_hash TEXT PRIMARY KEY,
		user_id INTEGER NOT NULL,
		expires_at TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`);

db.exec(`
	CREATE TABLE IF NOT EXISTS notifications (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		type TEXT NOT NULL,
		message TEXT NOT NULL,
		read_at TEXT,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`);

const SESSION_DAYS = 30;
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

function isLoginLimited(key) {
	const now = Date.now();
	const recent = (loginAttempts.get(key) || []).filter(timestamp => now - timestamp < LOGIN_WINDOW_MS);
	loginAttempts.set(key, recent);
	return recent.length >= LOGIN_MAX_ATTEMPTS;
}

function recordLoginFailure(key) {
	const recent = loginAttempts.get(key) || [];
	recent.push(Date.now());
	loginAttempts.set(key, recent);
}

function tokenHash(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
	const [salt, expectedHash] = storedHash.split(":");
	const actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
	return crypto.timingSafeEqual(
		Buffer.from(actualHash, "hex"),
		Buffer.from(expectedHash, "hex")
	);
}

function publicUser(user) {
	return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function signup(req, res) {
	const { name, email, password } = req.body || {};
	if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
		return res.status(400).json({ success: false, message: "Nom, e-mail et mot de passe de 6 caractères minimum requis." });
	}

	try {
		const normalizedEmail = email.trim().toLowerCase();
		const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
		if (existing) {
			return res.status(409).json({ success: false, message: "Cette adresse e-mail est déjà utilisée." });
		}

		const result = db.prepare(`
			INSERT INTO users (name, email, password_hash)
			VALUES (?, ?, ?)
		`).run(name.trim(), normalizedEmail, hashPassword(password));
		const user = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(result.lastInsertRowid);
		return createSession(user, res);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Impossible de créer le compte." });
	}
}

function login(req, res) {
	const { email, password } = req.body || {};
	if (!email?.trim() || !password) {
		return res.status(400).json({ success: false, message: "E-mail et mot de passe requis." });
	}

	const normalizedEmail = email.trim().toLowerCase();
	const attemptKey = `${req.ip}:${normalizedEmail}`;
	if (isLoginLimited(attemptKey)) {
		return res.status(429).json({ success: false, message: "Trop de tentatives. Réessayez dans quelques minutes." });
	}

	const user = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);
	if (!user || !verifyPassword(password, user.password_hash)) {
		recordLoginFailure(attemptKey);
		return res.status(401).json({ success: false, message: "E-mail ou mot de passe incorrect." });
	}
	loginAttempts.delete(attemptKey);

	return createSession(user, res);
}

function createSession(user, res) {
	const token = crypto.randomBytes(32).toString("hex");
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
	db.prepare(`
		INSERT INTO sessions (token_hash, user_id, expires_at)
		VALUES (?, ?, ?)
	`).run(tokenHash(token), user.id, expiresAt);
	return res.json({ success: true, token, user: publicUser(user) });
}

function getProfile(req, res) {
	return res.json({ success: true, user: req.user });
}

function listNotifications(req, res) {
	const notifications = db.prepare(`
		SELECT id, type, message, read_at, created_at
		FROM notifications
		WHERE user_id = ?
		ORDER BY created_at DESC
		LIMIT 50
	`).all(req.user.id);
	return res.json({ success: true, data: notifications });
}

function markNotificationsRead(req, res) {
	db.prepare("UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND read_at IS NULL")
		.run(req.user.id);
	return res.json({ success: true });
}

function logout(req, res) {
	db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(req.token));
	return res.json({ success: true, message: "Déconnexion réussie." });
}

function getSession(token) {
	if (!token) return null;
	const session = db.prepare(`
		SELECT s.user_id, u.name, u.email, u.role
		FROM sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP
	`).get(tokenHash(token));

	if (!session) {
		db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
		return null;
	}

	return publicUser({ id: session.user_id, name: session.name, email: session.email, role: session.role });
}

module.exports = { signup, login, getProfile, logout, getSession, hashPassword, listNotifications, markNotificationsRead };
