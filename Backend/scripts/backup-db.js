const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const backupDirectory = path.join(__dirname, "..", "backups");
fs.mkdirSync(backupDirectory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join(backupDirectory, `kitoko-afrika-${stamp}.db`);
db.backup(destination).then(() => {
  console.log(`Backup SQLite créé : ${destination}`);
});
