const crypto = require("crypto");
const db = require("../config/database");
const { publicMediaUrl } = require("./media");

// Une seule requête pour toutes les lectures de sites. Le média de
// couverture est l'image la plus récente (sous-requête), ce qui évite les
// doublons de sites qu'une jointure sur la table media produirait.
const SITE_SELECT = `
  SELECT
    s.id,
    s.slug,
    s.name,
    s.region,
    s.description,
    s.histoire,
    s.culture,
    s.savoirs,
    s.communities,
    s.langues,
    s.personnalites,
    s.infos_pratiques,
    s.documented_by,
    s.latitude,
    s.longitude,
    s.featured,
    s.status,
    s.verification_status,
    s.created_at,
    s.updated_at,
    s.owner_user_id AS owner_id,
    c.name AS country,
    c.flag AS country_flag,
    cat.slug AS category,
    cat.name AS category_label,
    (SELECT GROUP_CONCAT(src.title, ' ; ')
       FROM site_sources ss
       JOIN sources src ON src.id = ss.source_id
      WHERE ss.site_id = s.id) AS sources,
    (SELECT GROUP_CONCAT(t.slug)
       FROM site_themes st
       JOIN themes t ON t.id = st.theme_id
      WHERE st.site_id = s.id) AS theme_slugs,
    (SELECT COUNT(*) FROM quiz_questions q WHERE q.site_id = s.id) AS quiz_count,
    (SELECT m.type FROM media m WHERE m.site_id = s.id AND m.type IN ('image', 'video') ORDER BY m.id DESC LIMIT 1) AS media_type,
    (SELECT m.file_path FROM media m WHERE m.site_id = s.id AND m.type IN ('image', 'video') ORDER BY m.id DESC LIMIT 1) AS media_path
  FROM sites s
  JOIN countries c ON c.id = s.country_id
  JOIN categories cat ON cat.id = s.category_id
`;

function serializeSite(row) {
  if (!row) return row;
  const { media_path: mediaPath, theme_slugs: themeSlugs, ...site } = row;
  return {
    ...site,
    featured: Boolean(site.featured),
    sources: site.sources || "",
    themes: themeSlugs ? themeSlugs.split(",") : [],
    media_url: publicMediaUrl(mediaPath)
  };
}

function listSites({ publishedOnly = true } = {}) {
  const where = publishedOnly ? "WHERE s.status = 'published'" : "";
  return db.prepare(`${SITE_SELECT} ${where} ORDER BY c.name ASC, s.name ASC`).all().map(serializeSite);
}

// Accepte un identifiant numérique ou un slug (utilisé par les QR codes).
function findSite(idOrSlug, { publishedOnly = true } = {}) {
  const status = publishedOnly ? "AND s.status = 'published'" : "";
  const byId = /^\d+$/.test(String(idOrSlug));
  const row = db.prepare(`${SITE_SELECT} WHERE ${byId ? "s.id" : "s.slug"} = ? ${status}`).get(byId ? Number(idOrSlug) : String(idOrSlug));
  return serializeSite(row);
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const toRadians = degrees => degrees * Math.PI / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

// Fiche complète : galerie, récits, thèmes et lieux associés (les plus proches).
function siteDetails(site) {
  const media = db.prepare(`
    SELECT id, type, file_path, title, author, rights
    FROM media
    WHERE site_id = ?
    ORDER BY id ASC
  `).all(site.id).map(({ file_path: filePath, ...item }) => ({ ...item, url: publicMediaUrl(filePath) }));

  const recits = db.prepare(`
    SELECT r.id, r.title, r.body, r.nature, r.author_name, r.created_at, m.type AS media_type, m.file_path AS media_path
    FROM recits r
    LEFT JOIN media m ON m.id = r.media_id AND m.site_id IS NOT NULL
    WHERE r.site_id = ?
    ORDER BY r.id ASC
  `).all(site.id).map(({ media_path: mediaPath, ...recit }) => ({ ...recit, media_url: publicMediaUrl(mediaPath) }));

  const themes = db.prepare(`
    SELECT t.slug, t.name, t.icon
    FROM site_themes st JOIN themes t ON t.id = st.theme_id
    WHERE st.site_id = ?
    ORDER BY t.name
  `).all(site.id);

  let related = [];
  if (site.latitude != null && site.longitude != null) {
    related = db.prepare(`
      SELECT s.id, s.slug, s.name, s.latitude, s.longitude, cat.slug AS category, c.name AS country
      FROM sites s
      JOIN categories cat ON cat.id = s.category_id
      JOIN countries c ON c.id = s.country_id
      WHERE s.status = 'published' AND s.id <> ? AND s.latitude IS NOT NULL AND s.longitude IS NOT NULL
    `).all(site.id)
      .map(other => ({ ...other, distance_km: Math.round(distanceMeters(site.latitude, site.longitude, other.latitude, other.longitude) / 100) / 10 }))
      .filter(other => other.distance_km <= 150)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, 4);
  }

  const partners = db.prepare(`
    SELECT id, name, type, description, offer, locality, phone, whatsapp, email, website, languages
    FROM partners WHERE site_id = ? AND status = 'published' ORDER BY name
  `).all(site.id);

  return { ...site, media, recits, themes, related, partners };
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

function setSiteThemes(siteId, slugs) {
  db.prepare("DELETE FROM site_themes WHERE site_id = ?").run(siteId);
  const insert = db.prepare(`
    INSERT OR IGNORE INTO site_themes (site_id, theme_id)
    SELECT ?, id FROM themes WHERE slug = ?
  `);
  for (const slug of Array.isArray(slugs) ? slugs : []) insert.run(siteId, String(slug));
}

function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "site";
}

function uniqueSlug(name, siteId = null) {
  const base = slugify(name);
  let candidate = base;
  for (let suffix = 2; ; suffix++) {
    const taken = db.prepare("SELECT id FROM sites WHERE slug = ? AND id IS NOT ?").get(candidate, siteId);
    if (!taken) return candidate;
    candidate = `${base}-${suffix}`;
  }
}

// Code de secours affiché sur le site (panneau, guide) quand le GPS ne fonctionne pas.
// Alphabet sans caractères ambigus (0/O, 1/I…).
function newCheckinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.randomBytes(6), byte => alphabet[byte % alphabet.length]).join("");
}

// Complète les sites créés avant l'ajout des slugs et des codes de visite.
function backfillSiteIdentifiers() {
  const missing = db.prepare("SELECT id, name, slug, checkin_code FROM sites WHERE slug IS NULL OR checkin_code IS NULL").all();
  for (const site of missing) {
    db.prepare("UPDATE sites SET slug = ?, checkin_code = ? WHERE id = ?")
      .run(site.slug || uniqueSlug(site.name, site.id), site.checkin_code || newCheckinCode(), site.id);
  }
}

module.exports = {
  listSites,
  findSite,
  siteDetails,
  distanceMeters,
  setSiteSources,
  setSiteThemes,
  uniqueSlug,
  newCheckinCode,
  backfillSiteIdentifiers
};
