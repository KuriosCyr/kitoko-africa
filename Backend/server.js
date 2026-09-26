const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const db = require("./config/database");
const { hashPassword } = require("./controllers/auth.controller");
const siteRoutes = require("./routes/site.routes");
const countryRoutes = require("./routes/countries.routes");
const authRoutes = require("./routes/auth.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const contributionsRoutes = require("./routes/contributions.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 3000;

const ensureDefaultAdmin = () => {
  const email = process.env.ADMIN_EMAIL || "admin@kitokoafrika.org";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (!existing) {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run("Administrateur", email, hashPassword(password), "admin");
    console.log("✅ Compte admin de démonstration prêt : admin@kitokoafrika.org / admin123");
  }
};

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const frontendDirectory = path.join(__dirname, "..", "Frontend");
app.use(express.static(frontendDirectory));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDirectory, "index.html"));
});

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Kitoko Afrika API fonctionne",
    version: "1.0.0"
  });
});

// Routes principales
app.use("/api/sites", siteRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/contributions", contributionsRoutes);
app.use("/api/admin", adminRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route API introuvable."
  });
});

// Démarrage du serveur
ensureDefaultAdmin();

const cleanupExpiredSessions = () => {
  db.prepare("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP").run();
};
cleanupExpiredSessions();
const sessionCleanupTimer = setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
sessionCleanupTimer.unref();

app.listen(PORT, () => {
  console.log("");
  console.log("🌍 KITOKO AFRIKA API");
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log("");
});