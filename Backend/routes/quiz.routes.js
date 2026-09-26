const express = require("express");
const { requireAuth } = require("../middleware/auth");
const daily = require("../services/daily");

// Question du jour, séries et groupes de défi.
const router = express.Router();

function send(res, result, status = 200) {
  if (!result.ok) return res.status(result.status).json({ success: false, message: result.message });
  const { ok, ...data } = result;
  res.status(status).json({ success: true, data });
}

router.get("/pool", (req, res) => res.json({ success: true, data: daily.questionPool() }));
router.get("/daily/stats", requireAuth, (req, res) => res.json({ success: true, data: daily.dailyStats(req.user.id, typeof req.query.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.day) ? req.query.day : undefined) }));
router.post("/daily", requireAuth, (req, res) => send(res, daily.answerDaily(req.user.id, req.body || {})));
router.get("/leaderboard", requireAuth, (req, res) => res.json({ success: true, data: daily.leaderboard(req.user.id) }));
router.get("/groups", requireAuth, (req, res) => res.json({ success: true, data: daily.myGroups(req.user.id) }));
router.post("/groups", requireAuth, (req, res) => send(res, daily.createGroup(req.user.id, req.body?.name), 201));
router.post("/groups/join", requireAuth, (req, res) => send(res, daily.joinGroup(req.user.id, req.body?.code)));
router.delete("/groups/:id", requireAuth, (req, res) => send(res, daily.leaveGroup(req.user.id, Number(req.params.id))));

module.exports = router;
