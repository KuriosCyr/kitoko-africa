const db = require("../config/database");
const path = require("path");

function getSiteById(siteId) {
  return db.prepare(`
    SELECT
      s.id,
      s.name,
      s.region,
      s.description,
      s.histoire,
      s.culture,
      s.savoirs,
      s.communities,
      s.langues,
      s.personnalites,
      s.status,
      c.name AS country,
      cat.slug AS cat,
      users.email AS ownerEmail
    FROM sites s
    JOIN countries c ON c.id = s.country_id
    JOIN categories cat ON cat.id = s.category_id
    LEFT JOIN users ON users.id = s.owner_user_id
    WHERE s.id = ?
  `).get(siteId);
}

function listSites(req, res) {
  const sites = db.prepare(`
    SELECT
      s.id,
      s.name,
      s.region,
      s.description,
      s.histoire,
      s.culture,
      s.savoirs,
      s.communities,
      s.langues,
      s.personnalites,
      s.status,
      c.name AS country,
      cat.slug AS cat,
      users.email AS ownerEmail
    FROM sites s
    JOIN countries c ON c.id = s.country_id
    JOIN categories cat ON cat.id = s.category_id
    LEFT JOIN users ON users.id = s.owner_user_id
    WHERE s.status = 'published'
    ORDER BY s.id DESC
  `).all();

  return res.json({ success: true, data: sites });
}

function resolveSiteReferences(country, category) {
  const countryRow = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(country);
  const categoryRow = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category);
  return { countryRow, categoryRow };
}

function createSite(req, res) {
  const {
    name, country, cat, region, description, histoire, culture,
    savoirs, communities, langues, personnalites, sources
  } = req.body || {};

  if (!name?.trim() || !country?.trim() || !cat?.trim()) {
    return res.status(400).json({ success: false, message: "Nom, pays et catégorie requis." });
  }

  const { countryRow, categoryRow } = resolveSiteReferences(country.trim(), cat.trim());
  if (!countryRow || !categoryRow) {
    return res.status(400).json({ success: false, message: "Pays ou catégorie invalide." });
  }

  const result = db.prepare(`
    INSERT INTO sites (
      country_id, category_id, name, region, description, histoire, culture,
      savoirs, communities, langues, personnalites, status, owner_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
  `).run(
    countryRow.id,
    categoryRow.id,
    name.trim(),
    region?.trim() || "",
    description?.trim() || "",
    histoire?.trim() || "",
    culture?.trim() || "",
    savoirs?.trim() || "",
    communities?.trim() || "",
    langues?.trim() || "",
    personnalites?.trim() || "",
    req.user.id
  );

  return res.status(201).json({ success: true, data: getSiteById(result.lastInsertRowid) });
}

function updateSite(req, res) {
  const siteId = Number(req.params.id);
  const {
    name, country, cat, region, description, histoire, culture,
    savoirs, communities, langues, personnalites
  } = req.body || {};

  if (!Number.isInteger(siteId) || !name?.trim() || !country?.trim() || !cat?.trim()) {
    return res.status(400).json({ success: false, message: "Données du site invalides." });
  }

  if (!getSiteById(siteId)) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  const { countryRow, categoryRow } = resolveSiteReferences(country.trim(), cat.trim());
  if (!countryRow || !categoryRow) {
    return res.status(400).json({ success: false, message: "Pays ou catégorie invalide." });
  }

  db.prepare(`
    UPDATE sites
    SET country_id = ?, category_id = ?, name = ?, region = ?, description = ?,
        histoire = ?, culture = ?, savoirs = ?, communities = ?, langues = ?,
        personnalites = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    countryRow.id,
    categoryRow.id,
    name.trim(),
    region?.trim() || "",
    description?.trim() || "",
    histoire?.trim() || "",
    culture?.trim() || "",
    savoirs?.trim() || "",
    communities?.trim() || "",
    langues?.trim() || "",
    personnalites?.trim() || "",
    siteId
  );

  return res.json({ success: true, data: getSiteById(siteId) });
}

function deleteSite(req, res) {
  const siteId = Number(req.params.id);
  if (!Number.isInteger(siteId)) {
    return res.status(400).json({ success: false, message: "Identifiant de site invalide." });
  }

  const result = db.prepare("DELETE FROM sites WHERE id = ?").run(siteId);
  if (!result.changes) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  return res.json({ success: true, message: "Site supprimé." });
}

function listContributions(req, res) {
  const filters = [];
  const params = [];
  if (['pending', 'approved', 'rejected'].includes(req.query.status)) { filters.push('c.status = ?'); params.push(req.query.status); }
  if (req.query.country?.trim()) { filters.push('countries.name = ?'); params.push(req.query.country.trim()); }
  if (req.query.from) { filters.push('date(c.created_at) >= date(?)'); params.push(req.query.from); }
  if (req.query.to) { filters.push('date(c.created_at) <= date(?)'); params.push(req.query.to); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const contributions = db.prepare(`
    SELECT
      c.id,
      c.type,
      c.name,
      c.description,
      c.status,
      c.created_at,
      countries.name AS country,
      categories.slug AS cat,
      users.name AS contributor,
      users.email AS contributorEmail,
      EXISTS (
        SELECT 1 FROM media m WHERE m.contribution_id = c.id
        ) AS media,
        (SELECT m.type FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_type,
        (SELECT m.file_path FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_path
    FROM contributions c
    JOIN countries ON countries.id = c.country_id
    JOIN categories ON categories.id = c.category_id
    LEFT JOIN users ON users.id = c.user_id
    ${where}
    ORDER BY c.created_at DESC
  `).all(...params);

  contributions.forEach(item => {
    item.media_url = item.media_path ? `/uploads/${path.basename(item.media_path)}` : null;
    delete item.media_path;
  });
  return res.json({ success: true, data: contributions });
}

function listUsers(req, res) {
  const users = db.prepare(`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
  `).all();
  return res.json({ success: true, data: users });
}

function updateUserRole(req, res) {
  const userId = Number(req.params.id);
  const { role } = req.body || {};
  if (!Number.isInteger(userId) || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Rôle invalide.' });
  }
  const result = db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, userId);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
  return res.json({ success: true, data: db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(userId) });
}

function listModerationHistory(req, res) {
  const history = db.prepare(`
    SELECT m.id, m.decision, m.comment, m.created_at,
           c.id AS contribution_id, c.name AS contribution_name,
           u.name AS moderator
    FROM moderation m
    JOIN contributions c ON c.id = m.contribution_id
    JOIN users u ON u.id = m.moderator_user_id
    ORDER BY m.created_at DESC
    LIMIT 200
  `).all();
  return res.json({ success: true, data: history });
}

function moderateContribution(req, res) {
  const contributionId = Number(req.params.id);
  const { decision } = req.body || {};

  if (!Number.isInteger(contributionId) || !["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ success: false, message: "Décision de modération invalide." });
  }

  const contribution = db.prepare(`
    SELECT * FROM contributions WHERE id = ?
  `).get(contributionId);

  if (!contribution) {
    return res.status(404).json({ success: false, message: "Contribution introuvable." });
  }

  if (decision === "approved" && contribution.type === "new") {
    const siteResult = db.prepare(`
      INSERT INTO sites (
        country_id, category_id, name, description, status, owner_user_id
      )
      VALUES (?, ?, ?, ?, 'published', ?)
    `).run(
      contribution.country_id,
      contribution.category_id,
      contribution.name,
      contribution.description,
      contribution.user_id
    );

    db.prepare("UPDATE contributions SET status = 'approved', site_id = ? WHERE id = ?")
      .run(siteResult.lastInsertRowid, contributionId);

    db.prepare("UPDATE media SET site_id = ? WHERE contribution_id = ?")
      .run(siteResult.lastInsertRowid, contributionId);
  } else {
    db.prepare("UPDATE contributions SET status = ? WHERE id = ?")
      .run(decision, contributionId);
  }

  db.prepare(`
    INSERT INTO moderation (contribution_id, moderator_user_id, decision)
    VALUES (?, ?, ?)
  `).run(contributionId, req.user.id, decision);

  if (contribution.user_id) {
    db.prepare(`
      INSERT INTO notifications (user_id, type, message)
      VALUES (?, 'contribution_status', ?)
    `).run(
      contribution.user_id,
      decision === "approved"
        ? `Votre contribution « ${contribution.name || "sans nom"} » a été approuvée et publiée.`
        : `Votre contribution « ${contribution.name || "sans nom"} » a été rejetée.`
    );
  }

  return res.json({ success: true, status: decision });
}

module.exports = {
  listContributions,
  moderateContribution,
  listSites,
  createSite,
  updateSite,
  deleteSite,
  listUsers,
  updateUserRole,
  listModerationHistory
};
