const express = require("express");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createContribution, listMyContributions, getContributionMedia } = require("../controllers/contributions.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/mine", listMyContributions);
router.get("/media/:mediaId", getContributionMedia);
router.post("/", upload.single("media"), createContribution);

module.exports = router;
