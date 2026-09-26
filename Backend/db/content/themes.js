// Catégories (document de référence, § 10) et thèmes transversaux du passeport.

const CATEGORIES = [
  { slug: "historique", name: "Patrimoine historique" },
  { slug: "culturel", name: "Patrimoine culturel" },
  { slug: "naturel", name: "Patrimoine naturel" },
  { slug: "savoirs", name: "Savoirs et savoir-faire" },
  { slug: "memoire", name: "Mémoire et récits" }
];

const THEMES = [
  { slug: "memoire-traite", name: "Mémoire de la traite", icon: "⛓️" },
  { slug: "royaumes", name: "Royaumes et empires", icon: "👑" },
  { slug: "resistances", name: "Résistances et luttes", icon: "✊" },
  { slug: "spiritualites", name: "Spiritualités", icon: "🕊️" },
  { slug: "architecture", name: "Architecture", icon: "🏛️" },
  { slug: "artisanat", name: "Artisanat", icon: "🧵" },
  { slug: "gastronomie", name: "Gastronomie", icon: "🍲" },
  { slug: "musiques-danses", name: "Musiques et danses", icon: "🥁" },
  { slug: "festivals", name: "Fêtes et festivals", icon: "🎉" },
  { slug: "langues", name: "Langues et oralité", icon: "🗣️" },
  { slug: "faune-flore", name: "Faune et flore", icon: "🦁" },
  { slug: "eaux", name: "Fleuves, lacs et cascades", icon: "💧" },
  { slug: "marches", name: "Marchés et économie locale", icon: "🧺" }
];

module.exports = { CATEGORIES, THEMES };
