const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { listFavorites, addFavorite, removeFavorite } = require("../controllers/favorites.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", listFavorites);
router.post("/:siteId", addFavorite);
router.delete("/:siteId", removeFavorite);

module.exports = router;
