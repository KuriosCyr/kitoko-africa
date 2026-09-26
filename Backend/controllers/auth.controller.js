const crypto = require("crypto");
const db = require("../config/database");
const { sessionDays } = require("../config/env");

const SESSION_DAYS = sessionDays;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Les échecs de connexion sont gardés en base : la limite résiste aux redémarrages.
function isLoginLimited(key) {
	const since = Date.now() - LOGIN_WINDOW_MS;
	db.prepare("DELETE FROM login_attempts WHERE attempted_at < ?").run(since);
	const { total } = db.prepare("SELECT COUNT(*) AS total FROM login_attempts WHERE attempt_key = ? AND attempted_at >= ?").get(key, since);
	return total >= LOGIN_MAX_ATTEMPTS;
}

function recordLoginFailure(key) {
	db.prepare("INSERT INTO login_attempts (attempt_key, attempted_at) VALUES (?, ?)").run(key, Date.now());
}

function clearLoginFailures(key) {
	db.prepare("DELETE FROM login_attempts WHERE attempt_key = ?").run(key);
}

function tokenHash(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
	const [salt, expectedHash] = String(storedHash || "").split(":");
	if (!salt || !expectedHash) return false;
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
	if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
		return res.status(400).json({ success: false, message: "Nom, e-mail et mot de passe requis." });
	}
	if (!name.trim() || !EMAIL_PATTERN.test(email.trim()) || password.length < MIN_PASSWORD_LENGTH) {
		return res.status(400).json({ success: false, message: `Nom, e-mail valide et mot de passe de ${MIN_PASSWORD_LENGTH} caractères minimum requis.` });
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
	if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
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
	clearLoginFailures(attemptKey);

	return createSession(user, res);
}

function createSession(user, res) {
	const token = crypto.randomBytes(32).toString("hex");
	// Format SQLite (« AAAA-MM-JJ HH:MM:SS ») pour des comparaisons de dates fiables.
	db.prepare(`
		INSERT INTO sessions (token_hash, user_id, expires_at)
		VALUES (?, ?, datetime('now', ?))
	`).run(tokenHash(token), user.id, `+${SESSION_DAYS} days`);
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
		WHERE s.token_hash = ? AND datetime(s.expires_at) > datetime('now')
	`).get(tokenHash(token));

	if (!session) {
		db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
		return null;
	}

	return publicUser({ id: session.user_id, name: session.name, email: session.email, role: session.role });
}

// Suppression du compte (exigée par l'App Store et Google Play) : les données
// personnelles sont effacées ; les contributions publiées restent, sans auteur.
function deleteAccount(req, res) {
	const { password } = req.body || {};
	const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
	if (typeof password !== "string" || !verifyPassword(password, user.password_hash)) {
		return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
	}
	if (user.role === "admin") {
		return res.status(400).json({ success: false, message: "Un compte administrateur doit d'abord perdre son rôle avant d'être supprimé." });
	}
	if (db.prepare("SELECT 1 FROM moderation WHERE moderator_user_id = ? LIMIT 1").get(user.id)) {
		return res.status(400).json({ success: false, message: "Ce compte a participé à la modération : contactez l'équipe pour le supprimer." });
	}

	db.transaction(() => {
		db.prepare("UPDATE contributions SET user_id = NULL, credit_name = NULL WHERE user_id = ?").run(user.id);
		db.prepare("UPDATE sites SET owner_user_id = NULL WHERE owner_user_id = ?").run(user.id);
		db.prepare("UPDATE partners SET user_id = NULL WHERE user_id = ?").run(user.id);
		db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
		db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
	})();
	return res.json({ success: true, message: "Votre compte a été supprimé." });
}

function cleanupExpiredSessions() {
	db.prepare("DELETE FROM sessions WHERE datetime(expires_at) <= datetime('now')").run();
}

module.exports = {
	signup,
	login,
	getProfile,
	logout,
	getSession,
	hashPassword,
	verifyPassword,
	listNotifications,
	markNotificationsRead,
	deleteAccount,
	cleanupExpiredSessions
};
