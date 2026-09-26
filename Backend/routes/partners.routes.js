const express = require("express");
const { requireAuth } = require("../middleware/auth");
const partners = require("../controllers/partners.controller");

const router = express.Router();

router.get("/", partners.getPartners);
router.get("/types", partners.getPartnerTypes);
router.get("/mine", requireAuth, partners.listMyPartners);
router.post("/", requireAuth, partners.applyAsPartner);

module.exports = router;
