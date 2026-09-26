const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDirectory = path.join(__dirname, "..", "data");

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPath = path.join(dbDirectory, "kitoko-afrika.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

module.exports = db;