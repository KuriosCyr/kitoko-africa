const { getSession } = require("../controllers/auth.controller");

function requireAuth(req, res, next) {
	const header = req.headers.authorization || "";
	const token = header.startsWith("Bearer ") ? header.slice(7) : null;
	const user = token ? getSession(token) : null;

	if (!user) {
		return res.status(401).json({ success: false, message: "Authentification requise." });
	}

	req.token = token;
	req.user = user;
	next();
}

module.exports = { requireAuth };
