const express = require("express");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createContribution, listMyContributions } = require("../controllers/contributions.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/mine", listMyContributions);
router.post("/", upload.single("media"), createContribution);

module.exports = router;
