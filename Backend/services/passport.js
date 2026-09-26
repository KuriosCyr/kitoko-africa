const db = require("../config/database");
const { distanceMeters } = require("./sites");
const { circuitProgress } = require("./itineraries");

// Tolérance maximale accordée à l'imprécision du GPS (en mètres) : au-delà,
// une position trop floue ne suffit pas et le code du site est demandé.
const MAX_GPS_TOLERANCE_M = 150;

const WEST_AFRICA = new Set([
  "Bénin", "Burkina Faso", "Cabo Verde", "Côte d'Ivoire", "Gambie", "Ghana", "Guinée", "Guinée-Bissau",
  "Libéria", "Mali", "Mauritanie", "Niger", "Nigéria", "Sénégal", "Sierra Leone", "Togo"
]);

const DEMONYMS = {
  "Bénin": "béninois", "Guinée": "guinéen", "Sénégal": "sénégalais", "Côte d'Ivoire": "ivoirien",
  "Ghana": "ghanéen", "Togo": "togolais", "Mali": "malien", "Nigéria": "nigérian", "Maroc": "marocain",
  "Égypte": "égyptien", "Kenya": "kényan", "Afrique du Sud": "sud-africain", "Cameroun": "camerounais",
  "Burkina Faso": "burkinabè", "Niger": "nigérien"
};

const COUNTRY_BADGE_TARGET = 5;
const CATEGORY_BADGES = [
  { category: "memoire", slug: "gardien-memoire", name: "Gardien de la mémoire", icon: "🕯️", description: "Découvrir 3 lieux de mémoire." },
  { category: "historique", slug: "historien", name: "Historien en herbe", icon: "🏛️", description: "Découvrir 3 sites historiques." },
  { category: "culturel", slug: "curieux-cultures", name: "Curieux des cultures", icon: "🎭", description: "Découvrir 3 sites du patrimoine culturel." },
  { category: "naturel", slug: "ami-nature", name: "Ami de la nature", icon: "🌿", description: "Découvrir 3 sites naturels." },
  { category: "savoirs", slug: "passeur-savoirs", name: "Passeur de savoirs", icon: "🧺", description: "Découvrir 3 lieux porteurs de savoirs." }
];

function userStamps(userId) {
  return db.prepare(`
    SELECT st.id, st.site_id, st.kind, st.method, st.created_at,
           s.name AS site_name, s.slug AS site_slug, cat.slug AS category,
           c.name AS country, c.flag AS country_flag
    FROM stamps st
    JOIN sites s ON s.id = st.site_id
    JOIN categories cat ON cat.id = s.category_id
    JOIN countries c ON c.id = s.country_id
    WHERE st.user_id = ?
    ORDER BY st.created_at DESC, st.id DESC
  `).all(userId);
}

// Calcule tous les badges et leur progression à partir des tampons.
// « Sur place » ne compte que les visites validées physiquement ;
// les autres badges comptent aussi les découvertes en ligne.
function computeBadges(userId, stamps = userStamps(userId)) {
  const onsite = stamps.filter(stamp => stamp.kind === "onsite");
  const discoveredSites = new Map(stamps.map(stamp => [stamp.site_id, stamp]));
  const onsiteSites = new Map(onsite.map(stamp => [stamp.site_id, stamp]));
  const countOn = (sites, predicate) => [...sites.values()].filter(predicate).length;

  const countries = db.prepare(`
    SELECT c.name, COUNT(s.id) AS total
    FROM countries c JOIN sites s ON s.country_id = c.id AND s.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `).all();

  const correctAnswers = db.prepare("SELECT COUNT(*) AS total FROM quiz_attempts WHERE user_id = ? AND is_correct = 1").get(userId).total;
  const onsiteCountries = new Set([...onsiteSites.values()].map(stamp => stamp.country));
  const onsiteWestAfrica = [...onsiteCountries].filter(country => WEST_AFRICA.has(country)).length;

  const badges = [
    { slug: "premier-tampon", family: "decouverte", name: "Premier pas", icon: "✦", description: "Obtenir votre premier tampon.", progress: discoveredSites.size, target: 1 }
  ];

  for (const country of countries) {
    const target = Math.min(COUNTRY_BADGE_TARGET, country.total);
    const adjective = DEMONYMS[country.name];
    const label = adjective ? `du patrimoine ${adjective}` : `du patrimoine — ${country.name}`;
    badges.push({
      slug: `explorateur-${country.name}`, family: "sur_place", name: `Explorateur ${label}`, icon: "🧭",
      description: `Visiter sur place ${target} sites — ${country.name}.`,
      progress: countOn(onsiteSites, stamp => stamp.country === country.name), target
    });
    badges.push({
      slug: `connaisseur-${country.name}`, family: "en_ligne", name: `Connaisseur ${label}`, icon: "📖",
      description: `Découvrir ${target} sites — ${country.name}, sur place ou en ligne.`,
      progress: countOn(discoveredSites, stamp => stamp.country === country.name), target
    });
  }

  badges.push(
    { slug: "decouvreur-ouest-africain", family: "sur_place", name: "Découvreur du patrimoine ouest-africain", icon: "🌍", description: "Visiter sur place des sites dans 2 pays d'Afrique de l'Ouest.", progress: onsiteWestAfrica, target: 2 },
    { slug: "ambassadeur-africain", family: "sur_place", name: "Ambassadeur du patrimoine africain", icon: "👑", description: "Visiter sur place 15 sites dans au moins 3 pays.", progress: Math.min(onsiteSites.size, 15) + Math.min(onsiteCountries.size, 3), target: 18 }
  );

  for (const badge of CATEGORY_BADGES) {
    badges.push({ ...badge, family: "decouverte", progress: countOn(discoveredSites, stamp => stamp.category === badge.category), target: 3 });
  }
  for (const circuit of circuitProgress(userId)) {
    badges.push({ slug: `circuit-${circuit.slug}`, family: "decouverte", name: `Circuit : ${circuit.title}`, icon: circuit.icon || "🗺️", description: `Obtenir un tampon à chaque étape du circuit (${circuit.total} sites).`, progress: circuit.discovered, target: circuit.total });
  }
  const partnerStamps = db.prepare("SELECT COUNT(*) AS total FROM partner_stamps WHERE user_id = ?").get(userId).total;
  badges.push({ slug: "soutien-economie-locale", family: "sur_place", name: "Soutien de l'économie locale", icon: "🤝", description: "Faire tamponner votre passeport chez 3 acteurs locaux (guides, artisans, restaurants…).", progress: partnerStamps, target: 3 });
  badges.push({ slug: "esprit-curieux", family: "decouverte", name: "Esprit curieux", icon: "💡", description: "Donner 10 bonnes réponses aux quiz.", progress: correctAnswers, target: 10 });

  const earnedAt = new Map(db.prepare("SELECT badge, earned_at FROM user_badges WHERE user_id = ?").all(userId).map(row => [row.badge, row.earned_at]));
  return badges.map(badge => ({
    ...badge,
    progress: Math.min(badge.progress, badge.target),
    earned: badge.target > 0 && badge.progress >= badge.target,
    earned_at: earnedAt.get(badge.slug) || null
  }));
}

// Enregistre les badges nouvellement obtenus et prévient l'utilisateur.
function awardNewBadges(userId) {
  const fresh = computeBadges(userId).filter(badge => badge.earned && !badge.earned_at);
  const insert = db.prepare("INSERT OR IGNORE INTO user_badges (user_id, badge) VALUES (?, ?)");
  const notify = db.prepare("INSERT INTO notifications (user_id, type, message) VALUES (?, 'badge', ?)");
  for (const badge of fresh) {
    if (insert.run(userId, badge.slug).changes) {
      notify.run(userId, `Nouveau badge : ${badge.icon} ${badge.name} !`);
    }
  }
  return fresh.map(({ slug, name, icon }) => ({ slug, name, icon }));
}

function addStamp(userId, siteId, kind, method) {
  const result = db.prepare("INSERT OR IGNORE INTO stamps (user_id, site_id, kind, method) VALUES (?, ?, ?, ?)").run(userId, siteId, kind, method);
  return result.changes > 0;
}

// Valide une visite sur place : code du site, ou position GPS dans le rayon.
// La position n'est utilisée que pour ce calcul, jamais enregistrée.
function checkIn(userId, site, { latitude, longitude, accuracy, code }) {
  const row = db.prepare("SELECT latitude, longitude, checkin_radius_m, checkin_code FROM sites WHERE id = ?").get(site.id);

  let method = null;
  if (typeof code === "string" && code.trim()) {
    if (!row.checkin_code || code.trim().toUpperCase() !== row.checkin_code.toUpperCase()) {
      return { ok: false, status: 400, message: "Ce code ne correspond pas à ce site." };
    }
    method = "code";
  } else {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return { ok: false, status: 400, message: "Position invalide." };
    }
    if (row.latitude == null || row.longitude == null) {
      return { ok: false, status: 409, message: "Ce site n'a pas encore de coordonnées : utilisez le code affiché sur place." };
    }
    const distance = distanceMeters(lat, lon, row.latitude, row.longitude);
    const tolerance = Math.min(Math.max(Number(accuracy) || 0, 0), MAX_GPS_TOLERANCE_M);
    if (distance - tolerance > row.checkin_radius_m) {
      return {
        ok: false, status: 403,
        message: `Vous semblez être à ${distance >= 1000 ? `${Math.round(distance / 100) / 10} km` : `${Math.round(distance)} m`} du site. Rapprochez-vous, ou utilisez le code affiché sur place.`
      };
    }
    method = "gps";
  }

  const created = addStamp(userId, site.id, "onsite", method);
  return { ok: true, created, method, badges: awardNewBadges(userId) };
}

function publicQuestions(siteId) {
  return db.prepare("SELECT id, question, choices FROM quiz_questions WHERE site_id = ? ORDER BY position, id").all(siteId)
    .map(question => ({ ...question, choices: JSON.parse(question.choices) }));
}

// Corrige les réponses envoyées. Quand toutes les questions du site ont reçu
// une réponse (juste ou non : le quiz sert à apprendre), le tampon en ligne est accordé.
function answerQuiz(userId, siteId, answers) {
  const questions = db.prepare("SELECT id, answer_index, explanation, choices FROM quiz_questions WHERE site_id = ?").all(siteId);
  if (!questions.length) return { ok: false, status: 404, message: "Ce site n'a pas encore de quiz." };

  const record = db.prepare(`
    INSERT INTO quiz_attempts (user_id, question_id, is_correct, answered_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, question_id) DO UPDATE SET is_correct = MAX(is_correct, excluded.is_correct), answered_at = excluded.answered_at
  `);

  const results = [];
  for (const question of questions) {
    const given = answers?.[question.id] ?? answers?.[String(question.id)];
    if (given === undefined || given === null || given === "") continue;
    const correct = Number(given) === question.answer_index;
    record.run(userId, question.id, correct ? 1 : 0);
    results.push({
      question_id: question.id,
      correct,
      answer_index: question.answer_index,
      answer: JSON.parse(question.choices)[question.answer_index],
      explanation: question.explanation || ""
    });
  }

  const answered = db.prepare(`
    SELECT COUNT(*) AS total FROM quiz_attempts a JOIN quiz_questions q ON q.id = a.question_id
    WHERE a.user_id = ? AND q.site_id = ?
  `).get(userId, siteId).total;

  let stampCreated = false;
  if (answered >= questions.length) stampCreated = addStamp(userId, siteId, "online", "quiz");

  return {
    ok: true,
    results,
    score: results.filter(result => result.correct).length,
    total: results.length,
    completed: answered >= questions.length,
    stamp_created: stampCreated,
    badges: awardNewBadges(userId)
  };
}

function siteStatus(userId, siteId) {
  const stamps = db.prepare("SELECT kind, method, created_at FROM stamps WHERE user_id = ? AND site_id = ?").all(userId, siteId);
  const answered = db.prepare(`
    SELECT COUNT(*) AS total FROM quiz_attempts a JOIN quiz_questions q ON q.id = a.question_id
    WHERE a.user_id = ? AND q.site_id = ?
  `).get(userId, siteId).total;
  return {
    onsite: stamps.find(stamp => stamp.kind === "onsite") || null,
    online: stamps.find(stamp => stamp.kind === "online") || null,
    quiz_answered: answered
  };
}

// Vue d'ensemble du passeport : collection par pays, catégorie et thème.
function passportSummary(userId) {
  const stamps = userStamps(userId);
  const discovered = new Set(stamps.map(stamp => stamp.site_id));
  const visited = new Set(stamps.filter(stamp => stamp.kind === "onsite").map(stamp => stamp.site_id));
  const sites = db.prepare(`
    SELECT s.id, c.name AS country, c.flag, cat.slug AS category, cat.name AS category_label
    FROM sites s JOIN countries c ON c.id = s.country_id JOIN categories cat ON cat.id = s.category_id
    WHERE s.status = 'published'
  `).all();

  function group(keyOf, labelOf, extra = () => ({})) {
    const groups = new Map();
    for (const site of sites) {
      const key = keyOf(site);
      if (!groups.has(key)) groups.set(key, { key, label: labelOf(site), total: 0, discovered: 0, visited: 0, ...extra(site) });
      const entry = groups.get(key);
      entry.total++;
      if (discovered.has(site.id)) entry.discovered++;
      if (visited.has(site.id)) entry.visited++;
    }
    return [...groups.values()];
  }

  const countries = group(site => site.country, site => site.country, site => ({ flag: site.flag }))
    .sort((a, b) => b.discovered - a.discovered || a.label.localeCompare(b.label, "fr"));
  const categories = group(site => site.category, site => site.category_label);

  const themes = db.prepare(`
    SELECT t.slug AS key, t.name AS label, t.icon, st.site_id
    FROM themes t
    JOIN site_themes st ON st.theme_id = t.id
    JOIN sites s ON s.id = st.site_id AND s.status = 'published'
  `).all().reduce((map, row) => {
    if (!map.has(row.key)) map.set(row.key, { key: row.key, label: row.label, icon: row.icon, total: 0, discovered: 0, visited: 0 });
    const entry = map.get(row.key);
    entry.total++;
    if (discovered.has(row.site_id)) entry.discovered++;
    if (visited.has(row.site_id)) entry.visited++;
    return map;
  }, new Map());

  const partnerStamps = db.prepare(`
    SELECT ps.partner_id, ps.created_at, p.name, p.type, c.name AS country, c.flag AS country_flag
    FROM partner_stamps ps JOIN partners p ON p.id = ps.partner_id JOIN countries c ON c.id = p.country_id
    WHERE ps.user_id = ?
    ORDER BY ps.created_at DESC
  `).all(userId);

  return {
    stamps,
    partner_stamps: partnerStamps,
    totals: { sites: sites.length, discovered: discovered.size, visited: visited.size, partners: partnerStamps.length },
    countries,
    categories,
    themes: [...themes.values()].sort((a, b) => a.label.localeCompare(b.label, "fr")),
    badges: computeBadges(userId, stamps)
  };
}

module.exports = { checkIn, answerQuiz, publicQuestions, siteStatus, passportSummary, computeBadges, awardNewBadges };
