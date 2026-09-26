// Instantané hors connexion livré avec l'application mobile.
//
// Démarre l'API sur une base temporaire remplie avec les contenus du dépôt
// (Backend/db/content), enregistre les réponses publiques (pays, sites,
// fiches détaillées, thèmes, itinéraires…) dans www/offline/data.json et
// copie les photos dans www/offline/media/. L'application les affiche tant
// que le serveur n'est pas joignable ; dès qu'il répond, ses données prennent
// le relais.
//
// Nécessite les dépendances du serveur : (cd Backend && npm ci)
const fs = require("fs");
const os = require("os");
const path = require("path");

async function buildOfflineData(targetDir) {
  const backendDir = path.join(__dirname, "..", "..", "Backend");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kitoko-offline-"));
  process.env.NODE_ENV = "test";
  process.env.DB_PATH = path.join(tempDir, "offline.db");
  process.env.UPLOAD_DIR = path.join(tempDir, "uploads");
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;

  const { start } = require(path.join(backendDir, "server"));
  const { seed } = require(path.join(backendDir, "db", "seed"));
  seed({ log: () => {} });
  const server = start(0);
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const responses = {};
  async function save(pathname) {
    const response = await fetch(base + pathname);
    if (!response.ok) throw new Error(`${pathname} : ${response.status}`);
    responses[pathname] = await response.json();
    return responses[pathname];
  }

  try {
    for (const pathname of ["/countries", "/themes", "/categories", "/itineraries", "/partners/types", "/partners?"]) await save(pathname);
    const sites = (await save("/sites")).data;
    for (const site of sites) await save(`/sites/${site.id}`);

    // Photos référencées par les fiches (couvertures et galeries).
    const mediaDir = path.join(targetDir, "offline", "media");
    fs.mkdirSync(mediaDir, { recursive: true });
    const { publicDir } = require(path.join(backendDir, "services", "media"));
    const media = new Set();
    const addMedia = url => {
      const match = /^\/uploads\/([^/?#]+)$/.exec(url || "");
      if (!match) return;
      const name = decodeURIComponent(match[1]);
      const source = path.join(publicDir, name);
      if (!fs.existsSync(source)) return;
      fs.copyFileSync(source, path.join(mediaDir, name));
      media.add(name);
    };
    sites.forEach(site => addMedia(site.media_url));
    Object.entries(responses)
      .filter(([pathname]) => /^\/sites\/\d+$/.test(pathname))
      .forEach(([, detail]) => (detail.data.media || []).forEach(item => addMedia(item.url)));

    const data = { generatedAt: new Date().toISOString(), responses, media: [...media] };
    fs.writeFileSync(path.join(targetDir, "offline", "data.json"), JSON.stringify(data));
    return { sites: sites.length, media: media.size };
  } finally {
    server.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

module.exports = { buildOfflineData };
