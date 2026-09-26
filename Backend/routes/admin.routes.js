const express = require("express");
const { requireAdmin } = require("../middleware/admin");
const {
	listContributions,
	moderateContribution,
	listSites,
	createSite,
	updateSite,
	deleteSite,
	listUsers,
	updateUserRole,
	listModerationHistory
} = require("../controllers/admin.controller");

const router = express.Router();

router.use(requireAdmin);
router.get("/contributions", listContributions);
router.patch("/contributions/:id", moderateContribution);
router.get("/sites", listSites);
router.post("/sites", createSite);
router.patch("/sites/:id", updateSite);
router.delete("/sites/:id", deleteSite);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/moderation/history", listModerationHistory);

module.exports = router;
