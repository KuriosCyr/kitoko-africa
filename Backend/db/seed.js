const db = require("../config/database");
const { setSiteSources } = require("../services/sites");
const { COUNTRIES, ALL_AFRICA_COUNTRIES, SITES } = require("./seed-data");

const CATEGORIES = [
  { slug: "historique", name: "Historique" },
  { slug: "culturel", name: "Culturel" },
  { slug: "naturel", name: "Naturel" },
  { slug: "savoirs", name: "Savoirs" }
];

// Importe les pays, catégories et sites de démonstration. Relancer le seed
// ne remplace pas les fiches déjà présentes (les modifications faites depuis
// l'espace d'administration sont conservées) ; seuls les manquants sont ajoutés.
function seed({ log = console.log } = {}) {
  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (slug, name) VALUES (?, ?)");
  const upsertCountry = db.prepare(`
    INSERT INTO countries (name, code, flag, is_active)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(name) DO UPDATE SET code = excluded.code, flag = COALESCE(excluded.flag, countries.flag)
  `);
  const insertSite = db.prepare(`
    INSERT INTO sites (
      id, country_id, category_id, name, region, description, histoire, culture,
      savoirs, communities, langues, personnalites, featured, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
    ON CONFLICT(id) DO NOTHING
  `);
  const countryId = db.prepare("SELECT id FROM countries WHERE name = ?");
  const categoryId = db.prepare("SELECT id FROM categories WHERE slug = ?");

  let added = 0;
  const skipped = [];

  db.transaction(() => {
    CATEGORIES.forEach(category => insertCategory.run(category.slug, category.name));

    const flags = new Map(COUNTRIES.map(country => [country.name, country.flag]));
    ALL_AFRICA_COUNTRIES.forEach(([name, mapId]) => upsertCountry.run(name, mapId, flags.get(name) || null));

    for (const site of SITES) {
      const country = countryId.get(site.country);
      const category = categoryId.get(site.cat);
      if (!country || !category) {
        skipped.push(site.name);
        continue;
      }
      const result = insertSite.run(
        site.id, country.id, category.id, site.name, site.region || "", site.description || "",
        site.histoire || "", site.culture || "", site.savoirs || "", site.communities || "",
        site.langues || "", site.personnalites || "", site.featured ? 1 : 0
      );
      if (result.changes) {
        setSiteSources(site.id, site.sources);
        added++;
      }
    }
  })();

  const total = table => db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get().total;
  log(`✅ Base prête : ${total("countries")} pays, ${total("categories")} catégories, ${total("sites")} sites (${added} ajoutés), ${total("sources")} sources.`);
  if (skipped.length) log(`⚠️  Sites ignorés (pays ou catégorie inconnus) : ${skipped.join(", ")}`);
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
