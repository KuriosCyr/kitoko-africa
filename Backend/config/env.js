const path = require("path");

// Charge Backend/.env quel que soit le dossier depuis lequel le serveur est lancé.
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const isProduction = process.env.NODE_ENV === "production";

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

module.exports = {
  isProduction,
  port: positiveInteger(process.env.PORT, 3000),
  dbPath: process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.join(__dirname, "..", "data", "kitoko-afrika.db"),
  uploadDir: process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, "..", "uploads"),
  sessionDays: positiveInteger(process.env.SESSION_DAYS, 30),
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean),
  trustProxy: process.env.TRUST_PROXY || "",
  // Adresse publique du site, utilisée dans les QR codes (ex. https://kitokoafrika.org).
  // RENDER_EXTERNAL_URL est fourni automatiquement par Render.
  publicUrl: (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || "").trim().replace(/\/$/, ""),
  // Version de démonstration : bandeau, et code de visite visible pour tester à distance.
  demoMode: process.env.DEMO_MODE === "1",
  // Importe les contenus au démarrage (hébergements gratuits sans disque persistant).
  autoSeed: process.env.AUTO_SEED === "1",
  // Liens profonds : un QR code scanné ouvre directement l'application installée.
  androidPackage: (process.env.ANDROID_PACKAGE || "").trim(),
  androidSha256: (process.env.ANDROID_SHA256_FINGERPRINTS || "").split(",").map(value => value.trim()).filter(Boolean),
  appleAppId: (process.env.APPLE_APP_ID || "").trim()
};
