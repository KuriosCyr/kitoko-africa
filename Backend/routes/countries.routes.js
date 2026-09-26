const express = require("express");
const {
  getCountries
} = require("../controllers/countries.controller");

const router = express.Router();

router.get("/", getCountries);

module.exports = router;