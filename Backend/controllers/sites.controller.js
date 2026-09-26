const db = require("../config/database");
const { listSites, findSite, siteDetails } = require("../services/sites");

function getSites(req, res) {
  const sites = listSites();
  res.json({ success: true, count: sites.length, data: sites });
}

// Accepte un identifiant ou un slug (lien des QR codes).
function getSiteById(req, res) {
  const site = findSite(req.params.id);

  if (!site) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  res.json({ success: true, data: siteDetails(site) });
}

function getThemes(req, res) {
  const themes = db.prepare("SELECT slug, name, icon FROM themes ORDER BY name").all();
  res.json({ success: true, data: themes });
}

function getCategories(req, res) {
  const categories = db.prepare("SELECT slug, name FROM categories ORDER BY id").all();
  res.json({ success: true, data: categories });
}

module.exports = { getSites, getSiteById, getThemes, getCategories };
