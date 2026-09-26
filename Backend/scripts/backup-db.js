const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const backupDirectory = path.join(__dirname, "..", "backups");
fs.mkdirSync(backupDirectory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join(backupDirectory, `kitoko-afrika-${stamp}.db`);

db.backup(destination)
  .then(() => {
    console.log(`Sauvegarde SQLite créée : ${destination}`);
    console.log("Pensez aussi à sauvegarder le dossier uploads/ (photos et vidéos).");
  })
  .catch(error => {
    console.error("Échec de la sauvegarde :", error);
    process.exitCode = 1;
  });
