const express = require("express");
const { getSites, getSiteById } = require("../controllers/sites.controller");

const router = express.Router();

router.get("/", getSites);
router.get("/:id", getSiteById);

module.exports = router;
