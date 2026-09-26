const db = require("../config/database");
const partners = require("../services/partners");
const { awardNewBadges } = require("../services/passport");

function getPartnerTypes(req, res) {
  res.json({ success: true, data: Object.entries(partners.PARTNER_TYPES).map(([key, value]) => ({ key, ...value })) });
}

function getPartners(req, res) {
  res.json({ success: true, data: partners.listPublishedPartners({ siteId: req.query.site, country: req.query.country, type: req.query.type }) });
}

// Candidature d'un acteur local : examinée par l'équipe avant publication.
function applyAsPartner(req, res) {
  if (req.body?.charter !== true && req.body?.charter !== "true") {
    return res.status(400).json({ success: false, message: "Merci d'accepter la charte des partenaires." });
  }
  const input = partners.readPartnerInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });

  const id = partners.insertPartner(input, { status: "pending", userId: req.user.id });
  const notify = db.prepare("INSERT INTO notifications (user_id, type, message) VALUES (?, 'partner_application', ?)");
  for (const admin of db.prepare("SELECT id FROM users WHERE role = 'admin'").all()) {
    notify.run(admin.id, `Nouvelle demande de partenariat : « ${input.name} ».`);
  }
  res.status(201).json({ success: true, data: { id, status: "pending" } });
}

function listMyPartners(req, res) {
  const rows = db.prepare("SELECT id, name, type, status, checkin_code, created_at FROM partners WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id)
    .map(row => row.status === "published" ? row : { ...row, checkin_code: null });
  res.json({ success: true, data: rows });
}

// Tampon « économie locale » : le partenaire communique son code au visiteur.
function partnerCheckIn(req, res) {
  const partner = db.prepare("SELECT id, name, checkin_code FROM partners WHERE id = ? AND status = 'published'").get(Number(req.params.partnerId));
  if (!partner) return res.status(404).json({ success: false, message: "Partenaire introuvable." });
  const code = typeof req.body?.code === "string" ? req.body.code.trim().toUpperCase() : "";
  if (!code || code !== String(partner.checkin_code).toUpperCase()) {
    return res.status(400).json({ success: false, message: "Ce code ne correspond pas à ce partenaire." });
  }
  const created = db.prepare("INSERT OR IGNORE INTO partner_stamps (user_id, partner_id) VALUES (?, ?)").run(req.user.id, partner.id).changes > 0;
  res.status(created ? 201 : 200).json({ success: true, data: { created, badges: awardNewBadges(req.user.id) } });
}

// --- Administration ---------------------------------------------------------

function adminListPartners(req, res) {
  res.json({ success: true, data: partners.listAllPartners() });
}

function adminCreatePartner(req, res) {
  const input = partners.readPartnerInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });
  const id = partners.insertPartner(input, { status: req.body?.status === "pending" ? "pending" : "published" });
  res.status(201).json({ success: true, data: { id } });
}

function adminUpdatePartner(req, res) {
  const id = Number(req.params.partnerId);
  const current = db.prepare("SELECT status, user_id, name FROM partners WHERE id = ?").get(id);
  if (!current) return res.status(404).json({ success: false, message: "Partenaire introuvable." });
  const input = partners.readPartnerInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });
  const status = ["pending", "published", "rejected"].includes(req.body?.status) ? req.body.status : current.status;
  partners.updatePartner(id, input, status);

  if (current.user_id && status !== current.status && status !== "pending") {
    db.prepare("INSERT INTO notifications (user_id, type, message) VALUES (?, 'partner_status', ?)").run(
      current.user_id,
      status === "published"
        ? `Bienvenue parmi les partenaires Kitoko Afrika ! « ${input.name} » est maintenant visible. Votre code passeport est disponible dans votre profil.`
        : `Votre demande de partenariat « ${input.name} » n'a pas été retenue pour le moment.`
    );
  }
  res.json({ success: true });
}

function adminDeletePartner(req, res) {
  const result = db.prepare("DELETE FROM partners WHERE id = ?").run(Number(req.params.partnerId));
  if (!result.changes) return res.status(404).json({ success: false, message: "Partenaire introuvable." });
  res.json({ success: true });
}

module.exports = {
  getPartnerTypes, getPartners, applyAsPartner, listMyPartners, partnerCheckIn,
  adminListPartners, adminCreatePartner, adminUpdatePartner, adminDeletePartner
};
