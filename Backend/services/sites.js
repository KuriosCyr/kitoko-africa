const db = require("../config/database");
const { publicMediaUrl } = require("./media");

// Une seule requête pour toutes les lectures de sites. Le média retenu est
// le plus récent (sous-requêtes), ce qui évite les doublons de sites
// qu'une jointure sur la table media produisait.
const SITE_SELECT = `
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
    s.latitude,
    s.longitude,
    s.featured,
    s.status,
    s.owner_user_id AS owner_id,
    c.name AS country,
    c.flag AS country_flag,
    cat.slug AS category,
    cat.name AS category_label,
    (SELECT GROUP_CONCAT(src.title, ' ; ')
       FROM site_sources ss
       JOIN sources src ON src.id = ss.source_id
      WHERE ss.site_id = s.id) AS sources,
    (SELECT m.type FROM media m WHERE m.site_id = s.id ORDER BY m.id DESC LIMIT 1) AS media_type,
    (SELECT m.file_path FROM media m WHERE m.site_id = s.id ORDER BY m.id DESC LIMIT 1) AS media_path
  FROM sites s
  JOIN countries c ON c.id = s.country_id
  JOIN categories cat ON cat.id = s.category_id
`;

function serializeSite(row) {
  if (!row) return row;
  const { media_path: mediaPath, ...site } = row;
  return {
    ...site,
    featured: Boolean(site.featured),
    sources: site.sources || "",
    media_url: publicMediaUrl(mediaPath)
  };
}

function listSites({ publishedOnly = true } = {}) {
  const where = publishedOnly ? "WHERE s.status = 'published'" : "";
  return db.prepare(`${SITE_SELECT} ${where} ORDER BY s.id ASC`).all().map(serializeSite);
}

function findSite(siteId, { publishedOnly = true } = {}) {
  const status = publishedOnly ? "AND s.status = 'published'" : "";
  return serializeSite(db.prepare(`${SITE_SELECT} WHERE s.id = ? ${status}`).get(siteId));
}

// Remplace les sources d'un site par le texte saisi (une source par ligne
// ou séparée par « ; »), puis supprime les sources devenues orphelines.
function setSiteSources(siteId, text) {
  const titles = [...new Set(String(text || "")
    .split(/\r?\n| ; /)
    .map(title => title.trim())
    .filter(Boolean))];

  db.prepare("DELETE FROM site_sources WHERE site_id = ?").run(siteId);
  for (const title of titles) {
    const existing = db.prepare("SELECT id FROM sources WHERE title = ? ORDER BY id LIMIT 1").get(title);
    const sourceId = existing
      ? existing.id
      : db.prepare("INSERT INTO sources (title, verification_status) VALUES (?, 'unverified')").run(title).lastInsertRowid;
    db.prepare("INSERT OR IGNORE INTO site_sources (site_id, source_id) VALUES (?, ?)").run(siteId, sourceId);
  }
  db.prepare("DELETE FROM sources WHERE id NOT IN (SELECT source_id FROM site_sources)").run();
}

module.exports = { listSites, findSite, setSiteSources };
