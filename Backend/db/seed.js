const db = require("../config/database");
const { setSiteSources, setSiteThemes, setSiteExtras, uniqueSlug, newCheckinCode, backfillSiteIdentifiers } = require("../services/sites");
const { COUNTRIES, ALL_AFRICA_COUNTRIES, SITES: DRAFT_SITES } = require("./seed-data");
const { CATEGORIES, THEMES } = require("./content/themes");
const PROTOTYPE_SITES = [...require("./content/benin"), ...require("./content/guinee")];
const ITINERARIES = require("./content/itineraires");
const fs = require("fs");
const path = require("path");
const { publicDir } = require("../services/media");
const IMAGES_DIR = path.join(__dirname, "content", "images");
const IMAGE_CREDITS = fs.existsSync(path.join(__dirname, "content", "images.json")) ? require("./content/images.json") : {};

// Photos libres de droits (Wikimedia Commons) : copiées dans uploads/public et
// rattachées au site avec leurs crédits. Les médias ajoutés par l'équipe ou
// les contributeurs ne sont jamais touchés (seuls les fichiers « seed-… »).
function seedSitePhotos(siteId, slug) {
  const photos = IMAGE_CREDITS[slug] || [];
  db.prepare("DELETE FROM media WHERE site_id = ? AND file_path LIKE 'seed-%' AND contribution_id IS NULL").run(siteId);
  // Insérées de la dernière à la première : la première devient la photo de couverture.
  for (const photo of photos.slice().reverse()) {
    const source = path.join(IMAGES_DIR, photo.file);
    if (!fs.existsSync(source)) continue;
    const fileName = `seed-${photo.file}`;
    fs.copyFileSync(source, path.join(publicDir, fileName));
    db.prepare(`
      INSERT INTO media (site_id, type, file_path, title, author, rights, source_url)
      VALUES (?, 'image', ?, ?, ?, ?, ?)
    `).run(siteId, fileName, (photo.description || "").slice(0, 160) || null, photo.author, photo.license, photo.source);
  }
  return photos.length;
}

const DOCUMENTED_BY = "Équipe Kitoko Afrika";

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

  const stats = { added: 0, updated: 0, drafts: 0, questions: 0, photos: 0, skipped: [] };

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
      if (exists && !update) {
        // Site déjà présent : on ajoute seulement ses photos si elles manquent.
        const hasPhotos = db.prepare("SELECT 1 FROM media WHERE site_id = ? AND file_path LIKE 'seed-%' LIMIT 1").get(site.id);
        if (!hasPhotos) stats.photos += seedSitePhotos(site.id, site.slug);
        continue;
      }

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
            slug = ?, status = 'published', verification_status = 'verifie', updated_at = CURRENT_TIMESTAMP
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'verifie')
        `).run(...values, site.id, uniqueSlug(site.slug, site.id), newCheckinCode());
        stats.added++;
      }

      setSiteSources(site.id, site.sources.join("\n"));
      setSiteThemes(site.id, site.themes);
      setSiteExtras(site.id, {
        chronologie: (site.chronologie || []).map(([date, event]) => ({ date, event })),
        a_voir: (site.a_voir || []).map(([title, text]) => ({ title, text })),
        saviez_vous: site.saviez_vous || []
      });
      stats.photos += seedSitePhotos(site.id, site.slug);

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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'verifie', ?, ?)
      `).run(
        site.id, country.id, category.id, site.name, site.region || "", site.description || "",
        site.histoire || "", site.culture || "", site.savoirs || "", site.communities || "",
        site.langues || "", site.personnalites || "", site.featured ? 1 : 0, uniqueSlug(site.name, site.id), newCheckinCode()
      );
      setSiteSources(site.id, site.sources);
      stats.drafts++;
    }

    // Circuits : créés s'ils manquent, remis à jour avec --update.
    for (const itinerary of ITINERARIES) {
      const existing = db.prepare("SELECT id FROM itineraries WHERE slug = ?").get(itinerary.slug);
      if (existing && !update) continue;
      const country = countryId.get(itinerary.country);
      let id = existing?.id;
      if (existing) {
        db.prepare("UPDATE itineraries SET title = ?, country_id = ?, summary = ?, duration = ?, icon = ?, status = 'published' WHERE id = ?")
          .run(itinerary.title, country?.id ?? null, itinerary.summary, itinerary.duration, itinerary.icon, id);
      } else {
        id = db.prepare("INSERT INTO itineraries (slug, title, country_id, summary, duration, icon) VALUES (?, ?, ?, ?, ?, ?)")
          .run(itinerary.slug, itinerary.title, country?.id ?? null, itinerary.summary, itinerary.duration, itinerary.icon).lastInsertRowid;
      }
      db.prepare("DELETE FROM itinerary_stops WHERE itinerary_id = ?").run(id);
      itinerary.stops.forEach((stop, position) => {
        const site = db.prepare("SELECT id FROM sites WHERE slug = ?").get(stop.slug);
        if (site) db.prepare("INSERT INTO itinerary_stops (itinerary_id, site_id, position, note) VALUES (?, ?, ?, ?)").run(id, site.id, position, stop.note);
        else stats.skipped.push(`étape ${stop.slug}`);
      });
    }

    backfillSiteIdentifiers();
  })();

  const count = sql => db.prepare(sql).get().total;
  log(`✅ Base prête : ${count("SELECT COUNT(*) AS total FROM sites WHERE status = 'published'")} sites publiés, ${count("SELECT COUNT(*) AS total FROM sites WHERE status = 'draft'")} en brouillon, ${count("SELECT COUNT(*) AS total FROM quiz_questions")} questions de quiz, ${count("SELECT COUNT(*) AS total FROM themes")} thèmes, ${count("SELECT COUNT(*) AS total FROM itineraries")} itinéraires.`);
  log(`   ${stats.added} fiches ajoutées, ${stats.updated} mises à jour, ${stats.drafts} brouillons ajoutés, ${stats.photos} photos importées.`);
  if (!update && PROTOTYPE_SITES.some(site => siteExists.get(site.id)) && stats.added < PROTOTYPE_SITES.length) {
    log("   Les fiches déjà présentes n'ont pas été modifiées. Pour les remettre à jour depuis db/content : npm run db:update-content");
  }
  if (stats.skipped.length) log(`⚠️  Sites ignorés (pays ou catégorie inconnus) : ${stats.skipped.join(", ")}`);
}

if (require.main === module) {
  seed({ update: process.argv.includes("--update") });
}

module.exports = { seed };
