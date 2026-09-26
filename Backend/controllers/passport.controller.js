const { findSite } = require("../services/sites");
const passport = require("../services/passport");

function loadSite(req, res) {
  const site = findSite(req.params.siteId);
  if (!site) res.status(404).json({ success: false, message: "Site introuvable." });
  return site;
}

function getPassport(req, res) {
  res.json({ success: true, data: passport.passportSummary(req.user.id) });
}

function getSitePassport(req, res) {
  const site = loadSite(req, res);
  if (!site) return;
  res.json({ success: true, data: { ...passport.siteStatus(req.user.id, site.id), questions: passport.publicQuestions(site.id) } });
}

function checkIn(req, res) {
  const site = loadSite(req, res);
  if (!site) return;
  const result = passport.checkIn(req.user.id, site, req.body || {});
  if (!result.ok) return res.status(result.status).json({ success: false, message: result.message });
  res.status(result.created ? 201 : 200).json({ success: true, data: result });
}

function answerQuiz(req, res) {
  const site = loadSite(req, res);
  if (!site) return;
  const answers = req.body?.answers;
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ success: false, message: "Réponses manquantes." });
  }
  const result = passport.answerQuiz(req.user.id, site.id, answers);
  if (!result.ok) return res.status(result.status).json({ success: false, message: result.message });
  res.json({ success: true, data: result });
}

module.exports = { getPassport, getSitePassport, checkIn, answerQuiz };
