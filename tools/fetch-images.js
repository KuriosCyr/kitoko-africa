// Récupère des photos libres de droits sur Wikimedia Commons pour chaque site
// (Backend/db/content/images-manifest.json), avec auteur et licence.
// Résultat : Backend/db/content/images/*.webp et images.json (crédits).
// Utilisé par le workflow GitHub « Photos Wikimedia » ; peut aussi tourner en local.
const fs = require("fs");
const path = require("path");
const sharp = require(path.join(__dirname, "..", "Backend", "node_modules", "sharp"));

const CONTENT = path.join(__dirname, "..", "Backend", "db", "content");
const OUT_DIR = path.join(CONTENT, "images");
const manifest = JSON.parse(fs.readFileSync(path.join(CONTENT, "images-manifest.json"), "utf8"));
const PER_SITE = Number(process.env.PER_SITE || 3);
const API = "https://commons.wikimedia.org/w/api.php";
const HEADERS = { "User-Agent": "KitokoAfrika/1.0 (https://github.com/kurioscyr/kitoko-africa; contact@kitokoafrika.org)" };
const SKIP_TITLE = /\b(map|carte|chart|flag|drapeau|logo|coat|blason|stamp|timbre|locator|diagram|plan|svg|satellite|MNHN|chantier)\b/i;
// Cartes postales et photos de l'époque coloniale : écartées (esprit décolonial du projet).
const SKIP_COLONIAL = /(Guinée française|Afrique occidentale française|Dahomey \(colonie\)|carte postale|postcard|Fortier)/i;
const OK_LICENSE = /^(cc[ -]by(-sa)?[ -]?[0-9.]*( igo)?|cc0|public domain|pd|cc-by-sa-.*|cc-by-.*)$/i;

const stripHtml = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function search(query) {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrlimit: "12",
    gsrsearch: `${query} filetype:bitmap`, prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "1280"
  });
  const response = await fetch(`${API}?${params}`, { headers: HEADERS });
  if (!response.ok) throw new Error(`Commons ${response.status}`);
  const data = await response.json();
  return Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  // Les photos déjà choisies (et vérifiées à la main) sont conservées ; seuls
  // les sites sans photos sont cherchés. REFRESH=slug1,slug2 pour en refaire.
  const existing = fs.existsSync(path.join(CONTENT, "images.json")) ? JSON.parse(fs.readFileSync(path.join(CONTENT, "images.json"), "utf8")) : {};
  const refresh = new Set((process.env.REFRESH || "").split(",").map(item => item.trim()).filter(Boolean));
  const credits = {};
  for (const site of manifest.sites) {
    if (existing[site.slug] && !refresh.has(site.slug)) {
      credits[site.slug] = existing[site.slug];
      continue;
    }
    const exclude = new Set(site.exclude || []);
    const chosen = [];
    for (const query of site.queries) {
      if (chosen.length >= PER_SITE) break;
      let pages = [];
      try { pages = await search(query); } catch (error) { console.warn(`  ${site.slug}: ${error.message}`); }
      for (const page of pages) {
        if (chosen.length >= PER_SITE) break;
        const info = page.imageinfo?.[0];
        if (!info || exclude.has(page.title) || chosen.some(item => item.title === page.title)) continue;
        if (!/image\/(jpeg|png)/.test(info.mime) || info.width < 900 || SKIP_TITLE.test(page.title) || SKIP_COLONIAL.test(page.title)) continue;
        const meta = info.extmetadata || {};
        const license = stripHtml(meta.LicenseShortName?.value);
        if (!OK_LICENSE.test(license)) continue;
        chosen.push({
          title: page.title,
          url: info.thumburl || info.url,
          source: info.descriptionurl,
          author: stripHtml(meta.Artist?.value).slice(0, 120) || "Auteur inconnu",
          license,
          license_url: meta.LicenseUrl?.value || "",
          description: stripHtml(meta.ImageDescription?.value).slice(0, 200)
        });
      }
      await sleep(300);
    }

    credits[site.slug] = [];
    for (const [index, image] of chosen.entries()) {
      const file = `${site.slug}-${index + 1}.webp`;
      try {
        const response = await fetch(image.url, { headers: HEADERS });
        if (!response.ok) throw new Error(`téléchargement ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        await sharp(buffer).rotate().resize({ width: 1100, height: 830, fit: "inside", withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(OUT_DIR, file));
        credits[site.slug].push({ file, ...image });
      } catch (error) {
        console.warn(`  ${site.slug}: ${image.title} — ${error.message}`);
      }
      await sleep(300);
    }
    console.log(`${site.slug}: ${credits[site.slug].length} photo(s) — ${credits[site.slug].map(item => item.title).join(" | ")}`);
  }

  // Supprime les anciennes images qui ne sont plus référencées.
  const kept = new Set(Object.values(credits).flat().map(item => item.file));
  for (const file of fs.readdirSync(OUT_DIR)) if (!kept.has(file)) fs.rmSync(path.join(OUT_DIR, file));
  fs.writeFileSync(path.join(CONTENT, "images.json"), JSON.stringify(credits, null, 2) + "\n");
}

main().catch(error => { console.error(error); process.exit(1); });
