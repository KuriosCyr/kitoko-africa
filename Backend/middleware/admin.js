const { requireAuth } = require("./auth");

function requireAdmin(req, res, next) {
	requireAuth(req, res, () => {
		if (req.user.role !== "admin") {
			return res.status(403).json({ success: false, message: "Accès réservé à la modération." });
		}
		next();
	});
}

module.exports = { requireAdmin };
