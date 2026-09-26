const express = require("express");
const { signup, login, getProfile, logout, listNotifications, markNotificationsRead } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);
router.get("/notifications", requireAuth, listNotifications);
router.patch("/notifications/read", requireAuth, markNotificationsRead);
router.post("/logout", requireAuth, logout);

module.exports = router;
