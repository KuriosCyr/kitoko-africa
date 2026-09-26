const db = require("../config/database");
const { setSiteSources, setSiteThemes, uniqueSlug, newCheckinCode, backfillSiteIdentifiers } = require("../services/sites");
const { COUNTRIES, ALL_AFRICA_COUNTRIES, SITES: DRAFT_SITES } = require("./seed-data");
const { CATEGORIES, THEMES } = require("./content/themes");
const PROTOTYPE_SITES = [...require("./content/benin"), ...require("./content/guinee")];

const DOCUMENTED_BY = "Rédaction initiale : équipe Kitoko Afrika, assistée par IA — en attente de vérification par le Pôle Vérification.";

// Importe pays, catégories, thèmes et sites.
//
// Par défaut, relancer le seed n'écrase rien : seuls les éléments manquants
// sont ajoutés, et les modifications faites depuis l'administration sont
// conservées. Avec --update, les fiches du prototype (Bénin, Guinée) sont
// remises à jour à partir de db/content : textes, thèmes, sources, quiz et
// récits d'origine, et les fiches des autres pays repassent en brouillon.
// Les comptes, favoris, tampons, contributions et médias
// ne sont jamais touchés.
function seed({ log = console.log, update = false } = {}) {
  const countryId = db.prepare("SELECT id FROM countries WHERE name = ?");
  const categoryId = db.prepare("SELECT id FROM categories WHERE slug = ?");
  const siteExists = db.prepare("SELECT 1 FROM sites WHERE id = ?");

  const stats = { added: 0, updated: 0, drafts: 0, questions: 0, skipped: [] };

  db.transaction(() => {
    const upsertCategory = db.prepare("INSERT INTO categories (slug, name) VALUES (?, ?) ON CONFLICT(slug) DO UPDATE SET name = excluded.name");
    CATEGORIES.forEach(category => upsertCategory.run(category.slug, category.name));

    const upsertTheme = db.prepare("INSERT INTO themes (slug, name, icon) VALUES (?, ?, ?) ON CONFLICT(slug) DO UPDATE SET name = excluded.name, icon = excluded.icon");
    THEMES.forEach(theme => upsertTheme.run(theme.slug, theme.name, theme.icon));

    const upsertCountry = db.prepare(`
      INSERT INTO countries (name, code, flag, is_active)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(name) DO UPDATE SET code = excluded.code, flag = COALESCE(excluded.flag, countries.flag)
    `);
    const flags = new Map(COUNTRIES.map(country => [country.name, country.flag]));
    ALL_AFRICA_COUNTRIES.forEach(([name, mapId]) => upsertCountry.run(name, mapId, flags.get(name) || null));

    // Sites du prototype : Bénin et Guinée, publiés avec le statut « à vérifier ».
    for (const site of PROTOTYPE_SITES) {
      const country = countryId.get(site.country);
      const category = categoryId.get(site.cat);
      if (!country || !category) {
        stats.skipped.push(site.name);
        continue;
      }

      const exists = Boolean(siteExists.get(site.id));
      if (exists && !update) continue;

      const values = [
        country.id, category.id, site.name, site.region, site.description, site.histoire, site.culture,
        site.savoirs, site.communities, site.langues, site.personnalites, site.infos_pratiques, DOCUMENTED_BY,
        site.latitude, site.longitude, site.radius, site.featured ? 1 : 0
      ];

      if (exists) {
        db.prepare(`
          UPDATE sites SET country_id = ?, category_id = ?, name = ?, region = ?, description = ?, histoire = ?,
            culture = ?, savoirs = ?, communities = ?, langues = ?, personnalites = ?, infos_pratiques = ?,
            documented_by = ?, latitude = ?, longitude = ?, checkin_radius_m = ?, featured = ?,
            slug = ?, status = 'published', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(...values, uniqueSlug(site.slug, site.id), site.id);
        stats.updated++;
      } else {
        db.prepare(`
          INSERT INTO sites (
            country_id, category_id, name, region, description, histoire, culture, savoirs, communities,
            langues, personnalites, infos_pratiques, documented_by, latitude, longitude, checkin_radius_m,
            featured, id, slug, checkin_code, status, verification_status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'a_verifier')
        `).run(...values, site.id, uniqueSlug(site.slug, site.id), newCheckinCode());
        stats.added++;
      }

      setSiteSources(site.id, site.sources.join("\n"));
      setSiteThemes(site.id, site.themes);

      // Quiz et récits d'origine (les récits issus de contributions sont conservés).
      db.prepare("DELETE FROM quiz_questions WHERE site_id = ?").run(site.id);
      site.quiz.forEach((question, position) => {
        db.prepare(`
          INSERT INTO quiz_questions (site_id, question, choices, answer_index, explanation, position)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(site.id, question.question, JSON.stringify(question.choices), question.answer, question.explanation, position);
        stats.questions++;
      });
      db.prepare("DELETE FROM recits WHERE site_id = ? AND contribution_id IS NULL").run(site.id);
      for (const recit of site.recits) {
        db.prepare("INSERT INTO recits (site_id, title, body, nature) VALUES (?, ?, ?, ?)").run(site.id, recit.title, recit.body, recit.nature);
      }
    }

    // Fiches des autres pays : importées en brouillon, jamais écrasées.
    for (const site of DRAFT_SITES) {
      if (siteExists.get(site.id)) {
        if (update) db.prepare("UPDATE sites SET status = 'draft' WHERE id = ?").run(site.id);
        continue;
      }
      const country = countryId.get(site.country);
      const category = categoryId.get(site.cat);
      if (!country || !category) {
        stats.skipped.push(site.name);
        continue;
      }
      db.prepare(`
        INSERT INTO sites (
          id, country_id, category_id, name, region, description, histoire, culture, savoirs,
          communities, langues, personnalites, featured, status, verification_status, slug, checkin_code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'a_verifier', ?, ?)
      `).run(
        site.id, country.id, category.id, site.name, site.region || "", site.description || "",
        site.histoire || "", site.culture || "", site.savoirs || "", site.communities || "",
        site.langues || "", site.personnalites || "", site.featured ? 1 : 0, uniqueSlug(site.name, site.id), newCheckinCode()
      );
      setSiteSources(site.id, site.sources);
      stats.drafts++;
    }

    backfillSiteIdentifiers();
  })();

  const count = sql => db.prepare(sql).get().total;
  log(`✅ Base prête : ${count("SELECT COUNT(*) AS total FROM sites WHERE status = 'published'")} sites publiés, ${count("SELECT COUNT(*) AS total FROM sites WHERE status = 'draft'")} en brouillon, ${count("SELECT COUNT(*) AS total FROM quiz_questions")} questions de quiz, ${count("SELECT COUNT(*) AS total FROM themes")} thèmes.`);
  log(`   ${stats.added} fiches ajoutées, ${stats.updated} mises à jour, ${stats.drafts} brouillons ajoutés.`);
  if (!update && PROTOTYPE_SITES.some(site => siteExists.get(site.id)) && stats.added < PROTOTYPE_SITES.length) {
    log("   Les fiches déjà présentes n'ont pas été modifiées. Pour les remettre à jour depuis db/content : npm run db:update-content");
  }
  if (stats.skipped.length) log(`⚠️  Sites ignorés (pays ou catégorie inconnus) : ${stats.skipped.join(", ")}`);
}

if (require.main === module) {
  seed({ update: process.argv.includes("--update") });
}

module.exports = { seed };
