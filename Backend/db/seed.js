const fs = require("fs");
const path = require("path");
const vm = require("vm");
const db = require("../config/database");
const { hashPassword } = require("../controllers/auth.controller");

const APP_JS = path.join(__dirname, "../../Frontend/app.js");
const SCHEMA_SQL = path.join(__dirname, "schema.sql");

console.log("🌍 Initialisation de Kitoko Afrika...");

// --------------------------------------------------
// 1. Création de la structure
// --------------------------------------------------

const schema = fs.readFileSync(SCHEMA_SQL, "utf8");
db.exec(schema);

console.log("✅ Structure de la base créée.");

const adminEmail = "admin@kitokoafrika.org";
const adminPassword = "admin123";

db.prepare(`
  INSERT OR IGNORE INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`).run("Administrateur", adminEmail, hashPassword(adminPassword), "admin");

console.log("✅ Compte admin de démonstration : admin@kitokoafrika.org / admin123");

// --------------------------------------------------
// 2. Lecture des données du prototype
// --------------------------------------------------

const appCode = fs.readFileSync(APP_JS, "utf8");

function extractArray(source, variableName) {
  const marker = `const ${variableName} = [`;
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(`Impossible de trouver ${variableName} dans app.js`);
  }

  const arrayStart = source.indexOf("[", start);

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = arrayStart; i < source.length; i++) {
    const char = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "[") {
      depth++;
    }

    if (char === "]") {
      depth--;

      if (depth === 0) {
        return source.slice(arrayStart, i + 1);
      }
    }
  }

  throw new Error(`Tableau ${variableName} incomplet dans app.js`);
}

const countriesCode = extractArray(appCode, "COUNTRIES");
const allAfricaCountriesCode = extractArray(appCode, "ALL_AFRICA_COUNTRIES");
const sitesCode = extractArray(appCode, "SITES");

const sandbox = {};

const COUNTRIES = vm.runInNewContext(countriesCode, sandbox);
const allAfricaCountryPairs = vm.runInNewContext(allAfricaCountriesCode, sandbox);
const ALL_AFRICA_COUNTRIES = allAfricaCountryPairs.map(([name, mapId]) => ({ name, mapId }));
const SITES = vm.runInNewContext(sitesCode, sandbox);

console.log(`📦 Données détectées : ${COUNTRIES.length} pays, ${SITES.length} sites.`);

// --------------------------------------------------
// 3. Catégories
// --------------------------------------------------

const categories = [
  { slug: "historique", name: "Historique" },
  { slug: "culturel", name: "Culturel" },
  { slug: "naturel", name: "Naturel" },
  { slug: "savoirs", name: "Savoirs" }
];

const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (slug, name)
  VALUES (?, ?)
`);

for (const category of categories) {
  insertCategory.run(category.slug, category.name);
}

console.log(`✅ ${categories.length} catégories importées.`);

// --------------------------------------------------
// 4. Pays
// --------------------------------------------------

const insertCountry = db.prepare(`
  INSERT INTO countries
  (name, code, flag, is_active)
  VALUES (?, ?, ?, 1)
  ON CONFLICT(name) DO UPDATE SET
    code = excluded.code,
    flag = excluded.flag,
    is_active = excluded.is_active
`);

const knownCountries = new Map(COUNTRIES.map(country => [country.name, country]));
const allCountries = ALL_AFRICA_COUNTRIES.map(country => ({
  ...country,
  ...(knownCountries.get(country.name) || {})
}));

for (const country of allCountries) {
  insertCountry.run(
    country.name,
    country.mapId || null,
    country.flag || null
  );
}

console.log(`🌍 ${allCountries.length} pays africains importés.`);

// --------------------------------------------------
// 5. Fonctions utilitaires
// --------------------------------------------------

function getCountryId(name) {
  const row = db.prepare(`
    SELECT id
    FROM countries
    WHERE name = ?
  `).get(name);

  return row ? row.id : null;
}

function getCategoryId(slug) {
  const row = db.prepare(`
    SELECT id
    FROM categories
    WHERE slug = ?
  `).get(slug);

  return row ? row.id : null;
}

// --------------------------------------------------
// 6. Import des sites
// --------------------------------------------------

const insertSite = db.prepare(`
  INSERT OR REPLACE INTO sites (
    id,
    country_id,
    category_id,
    name,
    region,
    description,
    histoire,
    culture,
    savoirs,
    communities,
    langues,
    personnalites,
    latitude,
    longitude,
    status,
    owner_user_id
  )
  VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?
  )
`);

const insertSource = db.prepare(`
  INSERT INTO sources (
    title,
    verification_status
  )
  VALUES (?, 'unverified')
`);

const findSource = db.prepare(`
  SELECT id
  FROM sources
  WHERE title = ?
  ORDER BY id ASC
  LIMIT 1
`);

const insertSiteSource = db.prepare(`
  INSERT OR IGNORE INTO site_sources
  (site_id, source_id)
  VALUES (?, ?)
`);

const deduplicateSources = db.transaction(() => {
  const duplicateTitles = db.prepare(`
    SELECT title, MIN(id) AS keep_id
    FROM sources
    GROUP BY title
    HAVING COUNT(*) > 1
  `).all();

  for (const duplicate of duplicateTitles) {
    const duplicates = db.prepare(`
      SELECT id
      FROM sources
      WHERE title = ? AND id <> ?
    `).all(duplicate.title, duplicate.keep_id);

    for (const source of duplicates) {
      db.prepare(`
        INSERT OR IGNORE INTO site_sources (site_id, source_id)
        SELECT site_id, ?
        FROM site_sources
        WHERE source_id = ?
      `).run(duplicate.keep_id, source.id);
      db.prepare("DELETE FROM site_sources WHERE source_id = ?").run(source.id);
      db.prepare("DELETE FROM sources WHERE id = ?").run(source.id);
    }
  }
});

let importedSites = 0;
let importedSources = 0;
let skippedSites = 0;

const seedSites = db.transaction(() => {

  for (const site of SITES) {

    const countryId = getCountryId(site.country);
    const categoryId = getCategoryId(site.cat);

    if (!countryId) {
      console.warn(
        `⚠️ Pays introuvable pour le site "${site.name}" : ${site.country}`
      );
      skippedSites++;
      continue;
    }

    if (!categoryId) {
      console.warn(
        `⚠️ Catégorie introuvable pour le site "${site.name}" : ${site.cat}`
      );
      skippedSites++;
      continue;
    }

    insertSite.run(
      site.id,
      countryId,
      categoryId,
      site.name || null,
      site.region || null,
      site.description || null,
      site.histoire || null,
      site.culture || null,
      site.savoirs || null,
      site.communities || null,
      site.langues || null,
      site.personnalites || null,
      site.latitude ?? null,
      site.longitude ?? null,
      "published",
      null
    );

    importedSites++;

    // ----------------------------------------------
    // Sources
    // ----------------------------------------------

    if (site.sources && site.sources.trim()) {

      const sourceTitle = site.sources.trim();
      const existingSource = findSource.get(sourceTitle);
      const sourceId = existingSource
        ? existingSource.id
        : insertSource.run(sourceTitle).lastInsertRowid;

      insertSiteSource.run(site.id, sourceId);

      if (!existingSource) importedSources++;
    }
  }
});

deduplicateSources();
seedSites();

console.log(`✅ ${importedSites} sites importés.`);

if (skippedSites > 0) {
  console.log(`⚠️ ${skippedSites} sites ignorés.`);
}

console.log(`📚 ${importedSources} sources importées.`);

// --------------------------------------------------
// 7. Bilan réel de la base
// --------------------------------------------------

const totalCountries = db
  .prepare(`SELECT COUNT(*) AS total FROM countries`)
  .get().total;

const totalCategories = db
  .prepare(`SELECT COUNT(*) AS total FROM categories`)
  .get().total;

const totalSites = db
  .prepare(`SELECT COUNT(*) AS total FROM sites`)
  .get().total;

const totalSources = db
  .prepare(`SELECT COUNT(*) AS total FROM sources`)
  .get().total;

console.log("");
console.log("════════════════════════════════════");
console.log("📊 BILAN DE LA BASE KITOKO AFRIKA");
console.log("════════════════════════════════════");
console.log(`🌍 Pays       : ${totalCountries}`);
console.log(`🏷️ Catégories : ${totalCategories}`);
console.log(`📍 Sites      : ${totalSites}`);
console.log(`📚 Sources    : ${totalSources}`);
console.log("════════════════════════════════════");

if (totalSites === 37) {
  console.log("🎉 Les 37 sites du prototype sont bien importés !");
} else {
  console.log(
    `⚠️ Attention : ${totalSites} sites présents au lieu des 37 attendus.`
  );
}

console.log("🎉 Initialisation terminée.");