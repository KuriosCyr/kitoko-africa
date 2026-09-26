const express = require("express");
const { requireAdmin } = require("../middleware/admin");
const upload = require("../middleware/upload");
const admin = require("../controllers/admin.controller");
const partners = require("../controllers/partners.controller");

const router = express.Router();

router.use(requireAdmin);
router.get("/contributions", admin.listContributions);
router.patch("/contributions/:id", admin.moderateContribution);
router.get("/sites", admin.listSites);
router.post("/sites", admin.createSite);
router.get("/sites/:id", admin.getSite);
router.patch("/sites/:id", admin.updateSite);
router.delete("/sites/:id", admin.deleteSite);
router.post("/sites/:id/media", upload.single("media"), admin.uploadSiteMedia);
router.delete("/media/:mediaId", admin.deleteMedia);
router.post("/sites/:id/quiz", admin.createQuizQuestion);
router.patch("/quiz/:questionId", admin.updateQuizQuestion);
router.delete("/quiz/:questionId", admin.deleteQuizQuestion);
router.post("/sites/:id/recits", admin.createRecit);
router.delete("/recits/:recitId", admin.deleteRecit);
router.post("/sites/:id/checkin-code", admin.regenerateCheckinCode);
router.get("/sites/:id/qr.svg", admin.siteQrCode);
router.get("/partners", partners.adminListPartners);
router.post("/partners", partners.adminCreatePartner);
router.patch("/partners/:partnerId", partners.adminUpdatePartner);
router.delete("/partners/:partnerId", partners.adminDeletePartner);
router.get("/users", admin.listUsers);
router.patch("/users/:id/role", admin.updateUserRole);
router.get("/moderation/history", admin.listModerationHistory);

module.exports = router;
