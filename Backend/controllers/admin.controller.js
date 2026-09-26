const QRCode = require("qrcode");
const db = require("../config/database");
const { publicUrl } = require("../config/env");
const {
  listSites: listAllSites, findSite, siteDetails, setSiteSources, setSiteThemes, setSiteExtras, uniqueSlug, newCheckinCode
} = require("../services/sites");
const { publishMediaFile, unpublishMediaFile, deleteMediaFile } = require("../services/media");
const { prepareUploadedMedia, removeUploadedFile } = require("../services/media-processing");

const SITE_TEXT_FIELDS = ["region", "description", "histoire", "culture", "savoirs", "communities", "langues", "personnalites", "infos_pratiques", "documented_by"];
const RECIT_NATURES = ["tradition_orale", "temoignage", "recit_communautaire", "interpretation"];

function text(value, maxLength = 20000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Les administrateurs voient aussi les brouillons et le code de visite de secours.
// Rubriques saisies une entrée par ligne : « date | événement », « titre | texte ».
function readExtras(input) {
  const lines = value => String(value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const pairs = (value, first, second) => lines(value).map(line => {
    const [head, ...rest] = line.split("|");
    return rest.length ? { [first]: head.trim().slice(0, 120), [second]: rest.join("|").trim().slice(0, 1000) } : { [first]: "", [second]: head.trim().slice(0, 1000) };
  });
  return {
    chronologie: pairs(input.chronologie_text, "date", "event"),
    a_voir: pairs(input.a_voir_text, "title", "text"),
    saviez_vous: lines(input.saviez_vous_text).map(line => line.slice(0, 1000))
  };
}

function listSites(req, res) {
  const extras = new Map(db.prepare("SELECT id, checkin_code, checkin_radius_m FROM sites").all().map(row => [row.id, row]));
  const sites = listAllSites({ publishedOnly: false }).map(site => ({ ...site, ...extras.get(site.id) }));
  return res.json({ success: true, data: sites });
}

function getSite(req, res) {
  const site = findSite(req.params.id, { publishedOnly: false });
  if (!site) return res.status(404).json({ success: false, message: "Site introuvable." });
  const extras = db.prepare("SELECT checkin_code, checkin_radius_m FROM sites WHERE id = ?").get(site.id);
  const quiz = db.prepare("SELECT id, question, choices, answer_index, explanation, position FROM quiz_questions WHERE site_id = ? ORDER BY position, id")
    .all(site.id).map(question => ({ ...question, choices: JSON.parse(question.choices) }));
  return res.json({ success: true, data: { ...siteDetails(site), ...extras, quiz } });
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

  const coordinate = (value, limit) => {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) && Math.abs(number) <= limit ? number : NaN;
  };
  const latitude = coordinate(input.latitude, 90);
  const longitude = coordinate(input.longitude, 180);
  if (Number.isNaN(latitude) || Number.isNaN(longitude) || (latitude === null) !== (longitude === null)) {
    return { error: "Coordonnées invalides : indiquez latitude et longitude en degrés décimaux (ex. 6.3246 et 2.0890)." };
  }
  const radius = Number(input.checkin_radius_m);

  const fields = Object.fromEntries(SITE_TEXT_FIELDS.map(field => [field, text(input[field])]));
  return {
    name,
    countryId: countryRow.id,
    categoryId: categoryRow.id,
    featured: input.featured === true || input.featured === "true" || input.featured === 1 ? 1 : 0,
    status: input.status === "draft" ? "draft" : "published",
    verificationStatus: input.verification_status === "a_verifier" ? "a_verifier" : "verifie",
    latitude,
    longitude,
    radius: Number.isInteger(radius) && radius >= 50 && radius <= 50000 ? radius : 500,
    sources: text(input.sources),
    themes: Array.isArray(input.themes) ? input.themes.map(String) : [],
    extras: readExtras(input),
    ...fields
  };
}

const saveNewSite = db.transaction((site, ownerId) => {
  const result = db.prepare(`
    INSERT INTO sites (
      country_id, category_id, name, region, description, histoire, culture,
      savoirs, communities, langues, personnalites, infos_pratiques, documented_by,
      latitude, longitude, checkin_radius_m, featured, status, verification_status,
      slug, checkin_code, owner_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    site.countryId, site.categoryId, site.name, site.region, site.description, site.histoire,
    site.culture, site.savoirs, site.communities, site.langues, site.personnalites, site.infos_pratiques,
    site.documented_by, site.latitude, site.longitude, site.radius, site.featured, site.status,
    site.verificationStatus, uniqueSlug(site.name), newCheckinCode(), ownerId
  );
  setSiteSources(result.lastInsertRowid, site.sources);
  setSiteThemes(result.lastInsertRowid, site.themes);
  setSiteExtras(result.lastInsertRowid, site.extras);
  return result.lastInsertRowid;
});

const saveExistingSite = db.transaction((siteId, site) => {
  db.prepare(`
    UPDATE sites
    SET country_id = ?, category_id = ?, name = ?, region = ?, description = ?,
        histoire = ?, culture = ?, savoirs = ?, communities = ?, langues = ?,
        personnalites = ?, infos_pratiques = ?, documented_by = ?, latitude = ?, longitude = ?,
        checkin_radius_m = ?, featured = ?, status = ?, verification_status = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    site.countryId, site.categoryId, site.name, site.region, site.description, site.histoire,
    site.culture, site.savoirs, site.communities, site.langues, site.personnalites, site.infos_pratiques,
    site.documented_by, site.latitude, site.longitude, site.radius, site.featured, site.status,
    site.verificationStatus, siteId
  );
  setSiteSources(siteId, site.sources);
  setSiteThemes(siteId, site.themes);
  setSiteExtras(siteId, site.extras);
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
      c.nature,
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
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           (SELECT COUNT(*) FROM contributions c WHERE c.user_id = u.id) AS contributions,
           (SELECT COUNT(DISTINCT site_id) FROM stamps s WHERE s.user_id = u.id) AS stamps
    FROM users u
    ORDER BY CASE u.role WHEN 'admin' THEN 0 ELSE 1 END, u.created_at DESC
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
  if (contribution.type === "recit" || contribution.type === "media") {
    return decision === "approved"
      ? `Votre contribution « ${label} » a été publiée sur la fiche du site. Merci !`
      : `Votre contribution « ${label} » n'a pas été retenue.`;
  }
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
      INSERT INTO sites (country_id, category_id, name, region, description, status, verification_status, slug, checkin_code, owner_user_id)
      VALUES (?, ?, ?, ?, ?, 'published', 'verifie', ?, ?, ?)
    `).run(
      contribution.country_id,
      contribution.category_id,
      contribution.name,
      contribution.region || "",
      contribution.description,
      uniqueSlug(contribution.name),
      newCheckinCode(),
      contribution.user_id
    );

    db.prepare("UPDATE contributions SET status = 'approved', site_id = ? WHERE id = ?")
      .run(siteResult.lastInsertRowid, contribution.id);
    db.prepare("UPDATE media SET site_id = ? WHERE contribution_id = ?")
      .run(siteResult.lastInsertRowid, contribution.id);
  } else if (decision === "approved" && ["recit", "media"].includes(contribution.type) && contribution.site_id) {
    // Le média éventuel rejoint la galerie du site ; un récit devient une entrée de la fiche.
    db.prepare("UPDATE media SET site_id = ? WHERE contribution_id = ?").run(contribution.site_id, contribution.id);
    if (contribution.type === "recit") {
      const author = db.prepare("SELECT COALESCE(NULLIF(?, ''), name) AS name FROM users WHERE id = ?").get(contribution.credit_name, contribution.user_id);
      const media = db.prepare("SELECT id FROM media WHERE contribution_id = ? ORDER BY id DESC LIMIT 1").get(contribution.id);
      db.prepare(`
        INSERT INTO recits (site_id, title, body, nature, author_name, media_id, contribution_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(contribution.site_id, contribution.name, contribution.description, contribution.nature || "temoignage", author?.name || contribution.credit_name || null, media?.id ?? null, contribution.id);
    }
    db.prepare("UPDATE sites SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(contribution.site_id);
    db.prepare("UPDATE contributions SET status = 'approved' WHERE id = ?").run(contribution.id);
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

  if (decision === "approved" && ["new", "recit", "media"].includes(contribution.type)) {
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

function siteIdParam(req, res) {
  const site = findSite(req.params.id, { publishedOnly: false });
  if (!site) res.status(404).json({ success: false, message: "Site introuvable." });
  return site;
}

// Galerie : ajout direct d'un média par l'équipe (publié immédiatement).
async function uploadSiteMedia(req, res) {
  const site = siteIdParam(req, res);
  if (!site) return removeUploadedFile(req.file);
  if (!req.file) return res.status(400).json({ success: false, message: "Aucun fichier reçu." });

  let media;
  try {
    media = await prepareUploadedMedia(req.file);
  } catch (error) {
    removeUploadedFile(req.file);
    return res.status(422).json({ success: false, message: "Impossible de traiter ce fichier." });
  }
  const result = db.prepare(`
    INSERT INTO media (site_id, type, file_path, title, author, rights)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(site.id, media.type, media.fileName, text(req.body?.title, 200), text(req.body?.author, 200), text(req.body?.rights, 200));
  publishMediaFile(media.fileName);
  return res.status(201).json({ success: true, data: { id: result.lastInsertRowid, type: media.type } });
}

function deleteMedia(req, res) {
  const media = db.prepare("SELECT id, file_path, contribution_id FROM media WHERE id = ?").get(Number(req.params.mediaId));
  if (!media) return res.status(404).json({ success: false, message: "Média introuvable." });
  if (media.contribution_id) {
    // Média issu d'une contribution : retiré de la galerie mais conservé (privé).
    db.prepare("UPDATE media SET site_id = NULL WHERE id = ?").run(media.id);
    unpublishMediaFile(media.file_path);
  } else {
    db.prepare("DELETE FROM media WHERE id = ?").run(media.id);
    deleteMediaFile(media.file_path);
  }
  return res.json({ success: true });
}

function readQuizInput(body) {
  const question = text(body?.question, 500);
  const choices = (Array.isArray(body?.choices) ? body.choices : []).map(choice => text(String(choice), 200)).filter(Boolean);
  const answerIndex = Number(body?.answer_index);
  if (!question || choices.length < 2 || choices.length > 5 || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= choices.length) {
    return { error: "Question, 2 à 5 choix et la bonne réponse sont requis." };
  }
  return { question, choices, answerIndex, explanation: text(body?.explanation, 1000), position: Number.isInteger(Number(body?.position)) ? Number(body.position) : 0 };
}

function createQuizQuestion(req, res) {
  const site = siteIdParam(req, res);
  if (!site) return;
  const input = readQuizInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });
  const result = db.prepare(`
    INSERT INTO quiz_questions (site_id, question, choices, answer_index, explanation, position)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(site.id, input.question, JSON.stringify(input.choices), input.answerIndex, input.explanation, input.position);
  return res.status(201).json({ success: true, data: { id: result.lastInsertRowid } });
}

function updateQuizQuestion(req, res) {
  const input = readQuizInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });
  const result = db.prepare(`
    UPDATE quiz_questions SET question = ?, choices = ?, answer_index = ?, explanation = ?, position = ?
    WHERE id = ?
  `).run(input.question, JSON.stringify(input.choices), input.answerIndex, input.explanation, input.position, Number(req.params.questionId));
  if (!result.changes) return res.status(404).json({ success: false, message: "Question introuvable." });
  return res.json({ success: true });
}

function deleteQuizQuestion(req, res) {
  const result = db.prepare("DELETE FROM quiz_questions WHERE id = ?").run(Number(req.params.questionId));
  if (!result.changes) return res.status(404).json({ success: false, message: "Question introuvable." });
  return res.json({ success: true });
}

function createRecit(req, res) {
  const site = siteIdParam(req, res);
  if (!site) return;
  const title = text(req.body?.title, 200);
  const body = text(req.body?.body);
  if (!title || !body) return res.status(400).json({ success: false, message: "Titre et texte requis." });
  const nature = RECIT_NATURES.includes(req.body?.nature) ? req.body.nature : "tradition_orale";
  const result = db.prepare(`
    INSERT INTO recits (site_id, title, body, nature, author_name) VALUES (?, ?, ?, ?, ?)
  `).run(site.id, title, body, nature, text(req.body?.author_name, 200) || null);
  return res.status(201).json({ success: true, data: { id: result.lastInsertRowid } });
}

function deleteRecit(req, res) {
  const result = db.prepare("DELETE FROM recits WHERE id = ?").run(Number(req.params.recitId));
  if (!result.changes) return res.status(404).json({ success: false, message: "Récit introuvable." });
  return res.json({ success: true });
}

function regenerateCheckinCode(req, res) {
  const site = siteIdParam(req, res);
  if (!site) return;
  const code = newCheckinCode();
  db.prepare("UPDATE sites SET checkin_code = ? WHERE id = ?").run(code, site.id);
  return res.json({ success: true, data: { checkin_code: code } });
}

// QR code à imprimer sur place : il ouvre la fiche du site avec la
// validation de visite. L'adresse publique vient de PUBLIC_URL, sinon de la requête.
async function siteQrCode(req, res) {
  const site = siteIdParam(req, res);
  if (!site) return;
  const base = publicUrl || `${req.protocol}://${req.get("host")}`;
  const url = `${base}/s/${site.slug}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M", color: { dark: "#17211d", light: "#ffffff" } });
  res.set("Content-Type", "image/svg+xml");
  res.set("Content-Disposition", `inline; filename="qr-${site.slug}.svg"`);
  res.set("X-Site-Url", url);
  return res.send(svg);
}

module.exports = {
  getSite,
  uploadSiteMedia,
  deleteMedia,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  createRecit,
  deleteRecit,
  regenerateCheckinCode,
  siteQrCode,
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
