const db = require("../config/database");

function listFavorites(req, res) {
  const rows = db.prepare(`
    SELECT site_id
    FROM favorites
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id);

  return res.json({
    success: true,
    data: rows.map(row => row.site_id)
  });
}

function addFavorite(req, res) {
  const siteId = Number(req.params.siteId);
  if (!Number.isInteger(siteId)) {
    return res.status(400).json({ success: false, message: "Identifiant de site invalide." });
  }

  const site = db.prepare("SELECT id FROM sites WHERE id = ? AND status = 'published'").get(siteId);
  if (!site) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  db.prepare(`
    INSERT OR IGNORE INTO favorites (user_id, site_id)
    VALUES (?, ?)
  `).run(req.user.id, siteId);

  return res.status(201).json({ success: true, siteId });
}

function removeFavorite(req, res) {
  const siteId = Number(req.params.siteId);
  if (!Number.isInteger(siteId)) {
    return res.status(400).json({ success: false, message: "Identifiant de site invalide." });
  }

  db.prepare("DELETE FROM favorites WHERE user_id = ? AND site_id = ?").run(req.user.id, siteId);
  return res.json({ success: true, siteId });
}

module.exports = { listFavorites, addFavorite, removeFavorite };
