const db = require("../config/database");
const { adminEmail, adminPassword, isProduction } = require("../config/env");
const { hashPassword, verifyPassword } = require("../controllers/auth.controller");

const PLACEHOLDER_PASSWORDS = new Set(["change-this-password", "admin123", "password", "motdepasse"]);
const MIN_ADMIN_PASSWORD_LENGTH = 12;

// Crée le compte administrateur défini dans .env s'il n'existe pas encore.
// Aucun identifiant n'est codé en dur et le mot de passe n'est jamais affiché.
function ensureAdminAccount() {
  warnAboutDemoAdmins();

  if (!adminEmail || !adminPassword) {
    const hasAdmin = db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").get();
    if (!hasAdmin) {
      console.warn("⚠️  Aucun administrateur : définissez ADMIN_EMAIL et ADMIN_PASSWORD dans Backend/.env puis redémarrez.");
    }
    return;
  }

  const weak = adminPassword.length < MIN_ADMIN_PASSWORD_LENGTH || PLACEHOLDER_PASSWORDS.has(adminPassword);
  if (weak && isProduction) {
    console.error(`❌ ADMIN_PASSWORD est trop faible (${MIN_ADMIN_PASSWORD_LENGTH} caractères minimum, pas de valeur d'exemple) : compte admin non créé.`);
    return;
  }
  if (weak) {
    console.warn("⚠️  ADMIN_PASSWORD est faible : acceptable en local, refusé en production.");
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail);
  if (existing) return;

  db.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, 'admin')
  `).run("Administrateur", adminEmail, hashPassword(adminPassword));
  console.log(`✅ Compte administrateur créé : ${adminEmail}`);
}

// Les anciennes versions créaient un admin avec le mot de passe « admin123 ».
function warnAboutDemoAdmins() {
  const admins = db.prepare("SELECT email, password_hash FROM users WHERE role = 'admin'").all();
  for (const admin of admins) {
    if (verifyPassword("admin123", admin.password_hash)) {
      console.warn(`⚠️  L'administrateur ${admin.email} utilise encore le mot de passe de démonstration « admin123 » : changez-le ou supprimez ce compte.`);
    }
  }
}

module.exports = { ensureAdminAccount };
