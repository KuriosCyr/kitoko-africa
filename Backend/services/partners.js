const db = require("../config/database");
const { newCheckinCode } = require("./sites");

const PARTNER_TYPES = {
  guide: { label: "Guide", icon: "🧭" },
  artisan: { label: "Artisan", icon: "🧵" },
  restaurant: { label: "Restaurant / cuisine locale", icon: "🍲" },
  hebergement: { label: "Hébergement", icon: "🏡" },
  producteur: { label: "Producteur", icon: "🌾" },
  activite: { label: "Activité communautaire", icon: "🤝" }
};

const PUBLIC_FIELDS = `
  p.id, p.name, p.type, p.description, p.offer, p.locality, p.phone, p.whatsapp, p.email, p.website,
  p.languages, p.site_id, s.name AS site_name, s.slug AS site_slug, c.name AS country, c.flag AS country_flag
`;

function text(value, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Valide les champs d'un partenaire (candidature ou saisie par l'équipe).
function readPartnerInput(body) {
  const input = body || {};
  const name = text(input.name, 150);
  const type = PARTNER_TYPES[input.type] ? input.type : null;
  const country = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(text(input.country, 100));
  if (!name || !type || !country) return { error: "Nom, type d'activité et pays sont requis." };

  const site = input.site_id ? db.prepare("SELECT id FROM sites WHERE id = ?").get(Number(input.site_id)) : null;
  const phone = text(input.phone, 40);
  const whatsapp = text(input.whatsapp, 40);
  const email = text(input.email, 150);
  if (!phone && !whatsapp && !email) return { error: "Indiquez au moins un moyen de contact (téléphone, WhatsApp ou e-mail)." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Adresse e-mail invalide." };

  let website = text(input.website, 300);
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;

  return {
    name, type, countryId: country.id, siteId: site?.id ?? null,
    description: text(input.description, 1500), offer: text(input.offer, 300), locality: text(input.locality, 150),
    phone, whatsapp, email, website, languages: text(input.languages, 200)
  };
}

function listPublishedPartners({ siteId, country, type } = {}) {
  const filters = ["p.status = 'published'"];
  const params = [];
  if (siteId) { filters.push("p.site_id = ?"); params.push(Number(siteId)); }
  if (country) { filters.push("c.name = ?"); params.push(String(country)); }
  if (PARTNER_TYPES[type]) { filters.push("p.type = ?"); params.push(type); }
  return db.prepare(`
    SELECT ${PUBLIC_FIELDS}
    FROM partners p
    JOIN countries c ON c.id = p.country_id
    LEFT JOIN sites s ON s.id = p.site_id
    WHERE ${filters.join(" AND ")}
    ORDER BY c.name, p.name
  `).all(...params);
}

function listAllPartners() {
  return db.prepare(`
    SELECT ${PUBLIC_FIELDS}, p.status, p.checkin_code, p.created_at, u.name AS applicant, u.email AS applicant_email
    FROM partners p
    JOIN countries c ON c.id = p.country_id
    LEFT JOIN sites s ON s.id = p.site_id
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY CASE p.status WHEN 'pending' THEN 0 WHEN 'published' THEN 1 ELSE 2 END, p.created_at DESC
  `).all();
}

function insertPartner(input, { status, userId = null }) {
  return db.prepare(`
    INSERT INTO partners (name, type, description, offer, site_id, country_id, locality, phone, whatsapp, email, website, languages, status, checkin_code, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.name, input.type, input.description, input.offer, input.siteId, input.countryId, input.locality,
    input.phone, input.whatsapp, input.email, input.website, input.languages, status, newCheckinCode(), userId
  ).lastInsertRowid;
}

function updatePartner(id, input, status) {
  return db.prepare(`
    UPDATE partners SET name = ?, type = ?, description = ?, offer = ?, site_id = ?, country_id = ?, locality = ?,
      phone = ?, whatsapp = ?, email = ?, website = ?, languages = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    input.name, input.type, input.description, input.offer, input.siteId, input.countryId, input.locality,
    input.phone, input.whatsapp, input.email, input.website, input.languages, status, id
  ).changes;
}

module.exports = { PARTNER_TYPES, readPartnerInput, listPublishedPartners, listAllPartners, insertPartner, updatePartner };
