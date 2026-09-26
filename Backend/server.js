const config = require("./config/env");
const express = require("express");
const cors = require("cors");
const path = require("path");

const { cleanupExpiredSessions } = require("./controllers/auth.controller");
const { ensureAdminAccount } = require("./services/admin-bootstrap");
const { publicDir } = require("./services/media");
const siteRoutes = require("./routes/site.routes");
const countryRoutes = require("./routes/countries.routes");
const authRoutes = require("./routes/auth.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const contributionsRoutes = require("./routes/contributions.routes");
const adminRoutes = require("./routes/admin.routes");
const passportRoutes = require("./routes/passport.routes");
const { getThemes, getCategories } = require("./controllers/sites.controller");
const { backfillSiteIdentifiers } = require("./services/sites");

const app = express();

app.disable("x-powered-by");
if (config.trustProxy) {
  // Derrière un reverse proxy (Nginx…), nécessaire pour connaître la vraie IP
  // des visiteurs (limitation des tentatives de connexion).
  app.set("trust proxy", /^\d+$/.test(config.trustProxy) ? Number(config.trustProxy) : config.trustProxy);
}

app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });
  next();
});

// CORS : les origines autorisées sont listées dans CORS_ORIGINS (ex. le site
// web et l'application mobile). Sans liste, tout est accepté en développement
// et seul le site lui-même (même origine) fonctionne en production.
app.use("/api", cors({
  origin: config.corsOrigins.length ? config.corsOrigins : !config.isProduction
}));
app.use(express.json({ limit: "2mb" }));

const frontendDirectory = path.join(__dirname, "..", "Frontend");
app.use(express.static(frontendDirectory));
app.use("/uploads", express.static(publicDir, { dotfiles: "deny", index: false }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Kitoko Afrika API fonctionne", version: "1.1.0" });
});

app.use("/api/sites", siteRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/contributions", contributionsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/passport", passportRoutes);
app.get("/api/themes", getThemes);
app.get("/api/categories", getCategories);

// Lien imprimé dans les QR codes des sites : ouvre la fiche avec la
// validation de visite mise en avant.
app.get("/s/:slug", (req, res) => {
  res.redirect(302, `/?site=${encodeURIComponent(req.params.slug)}&scan=1`);
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable." });
});

// Toutes les erreurs sont renvoyées en JSON (et jamais la trace technique).
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, message: "Fichier trop volumineux (20 Mo maximum)." });
  }
  if (error.name === "MulterError") {
    return res.status(400).json({ success: false, message: "Envoi de fichier invalide." });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Requête JSON invalide." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Requête trop volumineuse." });
  }
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
});

function start(port = config.port) {
  ensureAdminAccount();
  backfillSiteIdentifiers();
  cleanupExpiredSessions();
  const sessionCleanupTimer = setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
  sessionCleanupTimer.unref();

  return app.listen(port, () => {
    console.log("");
    console.log("🌍 KITOKO AFRIKA API");
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    console.log("");
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
