const db = require("../config/database");
const { listSites: listAllSites, findSite, setSiteSources } = require("../services/sites");
const { publishMediaFile, unpublishMediaFile, deleteMediaFile } = require("../services/media");

const SITE_TEXT_FIELDS = ["region", "description", "histoire", "culture", "savoirs", "communities", "langues", "personnalites"];

function text(value, maxLength = 20000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function listSites(req, res) {
  return res.json({ success: true, data: listAllSites({ publishedOnly: false }) });
}

// Valide le corps d'une requête de création ou de modification de site.
function readSiteInput(body) {
  const input = body || {};
  const name = text(input.name, 200);
  const country = text(input.country, 200);
  const category = text(input.cat || input.category, 50);
  if (!name || !country || !category) {
    return { error: "Nom, pays et catégorie requis." };
  }

  const countryRow = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(country);
  const categoryRow = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category);
  if (!countryRow || !categoryRow) {
    return { error: "Pays ou catégorie invalide." };
  }

  const fields = Object.fromEntries(SITE_TEXT_FIELDS.map(field => [field, text(input[field])]));
  return {
    name,
    countryId: countryRow.id,
    categoryId: categoryRow.id,
    featured: input.featured === true || input.featured === "true" || input.featured === 1 ? 1 : 0,
    sources: text(input.sources),
    ...fields
  };
}

const saveNewSite = db.transaction((site, ownerId) => {
  const result = db.prepare(`
    INSERT INTO sites (
      country_id, category_id, name, region, description, histoire, culture,
      savoirs, communities, langues, personnalites, featured, status, owner_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
  `).run(
    site.countryId, site.categoryId, site.name, site.region, site.description, site.histoire,
    site.culture, site.savoirs, site.communities, site.langues, site.personnalites, site.featured, ownerId
  );
  setSiteSources(result.lastInsertRowid, site.sources);
  return result.lastInsertRowid;
});

const saveExistingSite = db.transaction((siteId, site) => {
  db.prepare(`
    UPDATE sites
    SET country_id = ?, category_id = ?, name = ?, region = ?, description = ?,
        histoire = ?, culture = ?, savoirs = ?, communities = ?, langues = ?,
        personnalites = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    site.countryId, site.categoryId, site.name, site.region, site.description, site.histoire,
    site.culture, site.savoirs, site.communities, site.langues, site.personnalites, site.featured, siteId
  );
  setSiteSources(siteId, site.sources);
});

function createSite(req, res) {
  const site = readSiteInput(req.body);
  if (site.error) {
    return res.status(400).json({ success: false, message: site.error });
  }
  const siteId = saveNewSite(site, req.user.id);
  return res.status(201).json({ success: true, data: findSite(siteId, { publishedOnly: false }) });
}

function updateSite(req, res) {
  const siteId = Number(req.params.id);
  if (!Number.isInteger(siteId)) {
    return res.status(400).json({ success: false, message: "Identifiant de site invalide." });
  }
  if (!findSite(siteId, { publishedOnly: false })) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  const site = readSiteInput(req.body);
  if (site.error) {
    return res.status(400).json({ success: false, message: site.error });
  }
  saveExistingSite(siteId, site);
  return res.json({ success: true, data: findSite(siteId, { publishedOnly: false }) });
}

function deleteSite(req, res) {
  const siteId = Number(req.params.id);
  if (!Number.isInteger(siteId)) {
    return res.status(400).json({ success: false, message: "Identifiant de site invalide." });
  }

  const siteMedia = db.prepare("SELECT file_path, contribution_id FROM media WHERE site_id = ?").all(siteId);

  // Les contributions liées au site sont conservées (historique) mais
  // détachées : sans cela, la contrainte de clé étrangère bloquait la suppression.
  const removed = db.transaction(() => {
    db.prepare("UPDATE contributions SET site_id = NULL WHERE site_id = ?").run(siteId);
    db.prepare("UPDATE media SET site_id = NULL WHERE site_id = ? AND contribution_id IS NOT NULL").run(siteId);
    db.prepare("DELETE FROM site_sources WHERE site_id = ?").run(siteId);
    const result = db.prepare("DELETE FROM sites WHERE id = ?").run(siteId);
    db.prepare("DELETE FROM sources WHERE id NOT IN (SELECT source_id FROM site_sources)").run();
    return result.changes;
  })();

  if (!removed) {
    return res.status(404).json({ success: false, message: "Site introuvable." });
  }

  // Les médias d'une contribution redeviennent privés ; les autres sont supprimés.
  for (const media of siteMedia) {
    if (media.contribution_id) unpublishMediaFile(media.file_path);
    else deleteMediaFile(media.file_path);
  }

  return res.json({ success: true, message: "Site supprimé." });
}

function listContributions(req, res) {
  const filters = [];
  const params = [];
  if (["pending", "approved", "rejected"].includes(req.query.status)) { filters.push("c.status = ?"); params.push(req.query.status); }
  if (typeof req.query.country === "string" && req.query.country.trim()) { filters.push("countries.name = ?"); params.push(req.query.country.trim()); }
  if (typeof req.query.from === "string" && req.query.from) { filters.push("date(c.created_at) >= date(?)"); params.push(req.query.from); }
  if (typeof req.query.to === "string" && req.query.to) { filters.push("date(c.created_at) <= date(?)"); params.push(req.query.to); }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const contributions = db.prepare(`
    SELECT
      c.id,
      c.type,
      c.name,
      c.region,
      c.description,
      c.status,
      c.created_at,
      c.site_id,
      sites.name AS target_name,
      countries.name AS country,
      categories.slug AS cat,
      COALESCE(NULLIF(c.credit_name, ''), users.name) AS contributor,
      users.email AS contributorEmail,
      (SELECT m.id FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_id,
      (SELECT m.type FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_type
    FROM contributions c
    LEFT JOIN countries ON countries.id = c.country_id
    LEFT JOIN categories ON categories.id = c.category_id
    LEFT JOIN users ON users.id = c.user_id
    LEFT JOIN sites ON sites.id = c.site_id
    ${where}
    ORDER BY c.created_at DESC, c.id DESC
  `).all(...params);

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
  if (!Number.isInteger(userId) || !["user", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Rôle invalide." });
  }

  const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable." });

  if (role === "user" && user.role === "admin") {
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "Vous ne pouvez pas retirer votre propre rôle d'administrateur." });
    }
    const { total } = db.prepare("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'").get();
    if (total <= 1) {
      return res.status(400).json({ success: false, message: "Impossible de retirer le dernier administrateur." });
    }
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
  return res.json({ success: true, data: db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(userId) });
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

function notificationMessage(contribution, decision) {
  const label = contribution.name || "sans nom";
  if (contribution.type === "edit") {
    return decision === "approved"
      ? `Votre suggestion de modification sur « ${label} » a été prise en compte. Merci !`
      : `Votre suggestion de modification sur « ${label} » n'a pas été retenue.`;
  }
  return decision === "approved"
    ? `Votre contribution « ${label} » a été approuvée et publiée.`
    : `Votre contribution « ${label} » a été rejetée.`;
}

// Toute la décision est appliquée dans une transaction : soit tout est
// enregistré (site, médias, historique, notification), soit rien.
const applyModeration = db.transaction((contribution, decision, moderatorId, comment) => {
  const current = db.prepare("SELECT status FROM contributions WHERE id = ?").get(contribution.id);
  if (current.status !== "pending") return false;

  if (decision === "approved" && contribution.type === "new") {
    const siteResult = db.prepare(`
      INSERT INTO sites (country_id, category_id, name, region, description, status, owner_user_id)
      VALUES (?, ?, ?, ?, ?, 'published', ?)
    `).run(
      contribution.country_id,
      contribution.category_id,
      contribution.name,
      contribution.region || "",
      contribution.description,
      contribution.user_id
    );

    db.prepare("UPDATE contributions SET status = 'approved', site_id = ? WHERE id = ?")
      .run(siteResult.lastInsertRowid, contribution.id);
    db.prepare("UPDATE media SET site_id = ? WHERE contribution_id = ?")
      .run(siteResult.lastInsertRowid, contribution.id);
  } else {
    db.prepare("UPDATE contributions SET status = ? WHERE id = ?").run(decision, contribution.id);
  }

  db.prepare(`
    INSERT INTO moderation (contribution_id, moderator_user_id, decision, comment)
    VALUES (?, ?, ?, ?)
  `).run(contribution.id, moderatorId, decision, comment || null);

  if (contribution.user_id) {
    db.prepare(`
      INSERT INTO notifications (user_id, type, message)
      VALUES (?, 'contribution_status', ?)
    `).run(contribution.user_id, notificationMessage(contribution, decision));
  }
  return true;
});

function moderateContribution(req, res) {
  const contributionId = Number(req.params.id);
  const { decision } = req.body || {};

  if (!Number.isInteger(contributionId) || !["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ success: false, message: "Décision de modération invalide." });
  }

  const contribution = db.prepare("SELECT * FROM contributions WHERE id = ?").get(contributionId);
  if (!contribution) {
    return res.status(404).json({ success: false, message: "Contribution introuvable." });
  }

  const applied = applyModeration(contribution, decision, req.user.id, text(req.body?.comment, 2000));
  if (!applied) {
    return res.status(409).json({ success: false, message: "Cette contribution a déjà été modérée." });
  }

  if (decision === "approved" && contribution.type === "new") {
    for (const media of db.prepare("SELECT file_path FROM media WHERE contribution_id = ?").all(contributionId)) {
      try {
        publishMediaFile(media.file_path);
      } catch (error) {
        console.error(`Impossible de publier le média ${media.file_path} :`, error);
      }
    }
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
