const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { dbPath } = require("./env");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// La structure est créée (ou complétée) à chaque démarrage : plus besoin
// de lancer le seed pour avoir des tables utilisables.
db.exec(fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8"));

function addColumnIfMissing(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(row => row.name);
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

// Migrations pour les bases créées avant l'ajout de ces colonnes.
addColumnIfMissing("sites", "featured", "INTEGER NOT NULL DEFAULT 0");
addColumnIfMissing("contributions", "region", "TEXT");
addColumnIfMissing("contributions", "credit_name", "TEXT");

module.exports = db;
