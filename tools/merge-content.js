// Intègre des fiches enrichies (textes, frise, points à voir, anecdotes,
// récits, quiz, sources) dans Backend/db/content/<pays>.js, en conservant
// l'identité de chaque site (id, slug, coordonnées, thèmes…).
//   node tools/merge-content.js <pays : benin, guinee, togo…> <fichier-enrichi.js>
const fs = require("fs");
const path = require("path");

const [country, overridesFile] = process.argv.slice(2);
const target = path.join(__dirname, "..", "Backend", "db", "content", `${country}.js`);
const sites = require(target);
const overrides = require(path.resolve(overridesFile));

const KEY_ORDER = ["id", "slug", "country", "cat", "name", "region", "featured", "latitude", "longitude", "radius", "themes",
  "description", "histoire", "culture", "savoirs", "communities", "langues", "personnalites", "infos_pratiques",
  "chronologie", "a_voir", "saviez_vous", "sources", "recits", "quiz"];

for (const [slug, data] of Object.entries(overrides)) {
  const site = sites.find(item => item.slug === slug);
  if (!site) throw new Error(`Site inconnu : ${slug}`);
  Object.assign(site, data);
}

// Sérialisation lisible (clés sans guillemets, comme les fichiers écrits à la main).
function serialize(value, indent) {
  const pad = "  ".repeat(indent);
  if (Array.isArray(value)) {
    if (value.every(item => typeof item !== "object" || item === null)) return `[${value.map(item => JSON.stringify(item)).join(", ")}]`;
    return `[\n${value.map(item => pad + "  " + serialize(item, indent + 1)).join(",\n")}\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort((a, b) => {
      const ia = KEY_ORDER.indexOf(a), ib = KEY_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    const oneLine = keys.every(key => typeof value[key] !== "object" || value[key] === null || (Array.isArray(value[key]) && value[key].every(item => typeof item !== "object")));
    if (oneLine && indent >= 2 && keys.length <= 5) return `{ ${keys.map(key => `${key}: ${serialize(value[key], indent + 1)}`).join(", ")} }`;
    return `{\n${keys.map(key => `${pad}  ${key}: ${serialize(value[key], indent + 1)}`).join(",\n")}\n${pad}}`;
  }
  return JSON.stringify(value);
}

const header = fs.readFileSync(target, "utf8").split("module.exports")[0];
fs.writeFileSync(target, `${header}module.exports = ${serialize(sites, 0)};\n`);
console.log(`${country} : ${Object.keys(overrides).length} fiche(s) mise(s) à jour.`);
