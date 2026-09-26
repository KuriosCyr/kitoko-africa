const { listSites, findSite } = require("../services/sites");

function getSites(req, res) {
  const sites = listSites();
  res.json({ success: true, count: sites.length, data: sites });
}

function getSiteById(req, res) {
  const siteId = Number(req.params.id);
  const site = Number.isInteger(siteId) ? findSite(siteId) : null;

  if (!site) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  res.json({ success: true, data: site });
}

module.exports = { getSites, getSiteById };
