// Prépare le dossier www/ de l'application mobile à partir du site (Frontend/)
// et y écrit l'adresse du serveur.
//
//   KITOKO_API_ORIGIN=https://api.kitokoafrika.org npm run build
//
// KITOKO_PUBLIC_URL (facultatif) : adresse publique utilisée dans les liens
// partagés et les QR codes, par défaut identique à KITOKO_API_ORIGIN.
const fs = require("fs");
const path = require("path");

const apiOrigin = (process.env.KITOKO_API_ORIGIN || "").trim().replace(/\/$/, "");
const publicUrl = (process.env.KITOKO_PUBLIC_URL || apiOrigin).trim().replace(/\/$/, "");

if (!/^https:\/\//.test(apiOrigin)) {
  console.error("❌ Indiquez l'adresse HTTPS du serveur : KITOKO_API_ORIGIN=https://… npm run build");
  console.error("   (les stores exigent HTTPS ; en test sur un émulateur Android : KITOKO_API_ORIGIN=http://10.0.2.2:3000 est accepté avec ALLOW_HTTP=1)");
  if (!(process.env.ALLOW_HTTP === "1" && /^http:\/\//.test(apiOrigin))) process.exit(1);
}

// Version de l'APK et dépôt où sont publiées les nouvelles versions
// (l'application prévient quand une version plus récente existe).
const appVersion = (process.env.APP_VERSION_NAME || "").trim();
const updateRepo = (process.env.KITOKO_UPDATE_REPO || process.env.GITHUB_REPOSITORY || "").trim();

const source = path.join(__dirname, "..", "..", "Frontend");
const target = path.join(__dirname, "..", "www");
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

fs.writeFileSync(path.join(target, "config.js"), `// Généré par mobile/scripts/build-www.js — ne pas modifier.
window.KITOKO_CONFIG = ${JSON.stringify({ apiOrigin, publicUrl, nativeApp: true, appVersion, updateRepo }, null, 2)};
`);

// Contenus et photos embarqués pour l'utilisation hors connexion.
require("./build-offline-data").buildOfflineData(target)
  .then(({ sites, media }) => {
    console.log(`✅ Hors connexion : ${sites} fiches et ${media} photos embarquées`);
    console.log(`✅ www/ prêt (API : ${apiOrigin}, liens publics : ${publicUrl})`);
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Instantané hors connexion impossible (lancer d'abord : cd Backend && npm ci)", error);
    process.exit(1);
  });
