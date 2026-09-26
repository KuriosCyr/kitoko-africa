// Question du jour, séries, groupes de défi et frise panafricaine.
const crypto = require("crypto");
const db = require("../config/database");
const { parseExtras } = require("./sites");

// ---------------------------------------------------------------------------
// Question du jour
// ---------------------------------------------------------------------------

// Toutes les questions des sites publiés, dans un ordre stable. Les réponses
// sont incluses : la question du jour doit fonctionner hors connexion, et les
// quiz de site accordent leur tampon même en cas d'erreur (ils servent à apprendre).
function questionPool() {
  return db.prepare(`
    SELECT q.id, q.site_id, s.slug, s.name AS site_name, c.name AS country, q.question, q.choices,
      q.answer_index, q.explanation
    FROM quiz_questions q
    JOIN sites s ON s.id = q.site_id
    JOIN countries c ON c.id = s.country_id
    WHERE s.status = 'published'
    ORDER BY q.id
  `).all().map(question => ({ ...question, choices: JSON.parse(question.choices) }));
}

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function dayNumber(day) {
  const [year, month, date] = day.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, date) / 86400000);
}

// Même calcul que dans l'application (Frontend/features.js).
function dailyIndex(day, size) {
  let value = (dayNumber(day) * 2654435761) >>> 0;
  value = (value ^ (value >>> 15)) >>> 0;
  return value % size;
}

function shiftDay(day, offset) {
  return new Date((dayNumber(day) + offset) * 86400000).toISOString().slice(0, 10);
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function dailyStats(userId, today = todayUtc()) {
  const rows = db.prepare("SELECT day, correct FROM quiz_daily WHERE user_id = ? ORDER BY day DESC").all(userId);
  const days = new Set(rows.map(row => row.day));
  // Série en cours : jours consécutifs joués jusqu'à aujourd'hui (ou hier, si
  // la question du jour n'a pas encore été jouée).
  let streak = 0;
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  while (days.has(cursor)) { streak++; cursor = shiftDay(cursor, -1); }
  let best = 0;
  let run = 0;
  let previous = null;
  rows.slice().reverse().forEach(row => {
    run = previous && dayNumber(row.day) - dayNumber(previous) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = row.day;
  });
  return {
    streak,
    best,
    played: rows.length,
    correct: rows.filter(row => row.correct).length,
    answered_today: days.has(today)
  };
}

function answerDaily(userId, { day, question_id: questionId, choice }) {
  if (!DAY_PATTERN.test(day || "")) return { ok: false, status: 400, message: "Date invalide." };
  // Le jour est celui du téléphone : on accepte un jour d'écart avec le serveur (fuseaux horaires).
  if (Math.abs(dayNumber(day) - dayNumber(todayUtc())) > 1) return { ok: false, status: 400, message: "Cette question n'est plus celle du jour." };
  const pool = questionPool();
  if (!pool.length) return { ok: false, status: 404, message: "Aucune question disponible." };
  const question = pool[dailyIndex(day, pool.length)];
  if (Number(questionId) !== question.id) return { ok: false, status: 409, message: "La question du jour a changé : rechargez." };
  const index = Number(choice);
  if (!Number.isInteger(index) || index < 0 || index >= question.choices.length) return { ok: false, status: 400, message: "Réponse invalide." };
  const correct = index === question.answer_index;
  const existing = db.prepare("SELECT correct FROM quiz_daily WHERE user_id = ? AND day = ?").get(userId, day);
  if (!existing) db.prepare("INSERT INTO quiz_daily (user_id, day, question_id, correct) VALUES (?, ?, ?, ?)").run(userId, day, question.id, correct ? 1 : 0);
  return {
    ok: true,
    already_answered: Boolean(existing),
    correct: existing ? Boolean(existing.correct) : correct,
    answer_index: question.answer_index,
    explanation: question.explanation,
    stats: dailyStats(userId, day)
  };
}

// Nom affiché dans les classements : prénom et initiale seulement.
function displayName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Anonyme";
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
}

function ranking(userIds, currentUserId) {
  const since = shiftDay(todayUtc(), -30);
  const rows = userIds.map(userId => {
    const user = db.prepare("SELECT id, name FROM users WHERE id = ?").get(userId);
    if (!user) return null;
    const points = db.prepare("SELECT COUNT(*) AS total FROM quiz_daily WHERE user_id = ? AND correct = 1 AND day >= ?").get(userId, since).total;
    const stats = dailyStats(userId);
    return { name: displayName(user.name), points, streak: stats.streak, is_me: userId === currentUserId };
  }).filter(Boolean);
  return rows.sort((a, b) => b.points - a.points || b.streak - a.streak).map((row, index) => ({ rank: index + 1, ...row }));
}

function leaderboard(currentUserId) {
  const since = shiftDay(todayUtc(), -30);
  const ids = db.prepare("SELECT DISTINCT user_id FROM quiz_daily WHERE day >= ?").all(since).map(row => row.user_id);
  return ranking(ids, currentUserId).slice(0, 10);
}

// ---------------------------------------------------------------------------
// Groupes de défi
// ---------------------------------------------------------------------------

function newGroupCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (;;) {
    const code = Array.from(crypto.randomBytes(6), byte => alphabet[byte % alphabet.length]).join("");
    if (!db.prepare("SELECT 1 FROM quiz_groups WHERE code = ?").get(code)) return code;
  }
}

function createGroup(userId, name) {
  const clean = String(name || "").trim().slice(0, 60);
  if (clean.length < 2) return { ok: false, status: 400, message: "Donnez un nom au groupe." };
  const count = db.prepare("SELECT COUNT(*) AS total FROM quiz_groups WHERE owner_id = ?").get(userId).total;
  if (count >= 10) return { ok: false, status: 400, message: "Vous avez déjà créé 10 groupes." };
  const code = newGroupCode();
  const id = db.prepare("INSERT INTO quiz_groups (code, name, owner_id) VALUES (?, ?, ?)").run(code, clean, userId).lastInsertRowid;
  db.prepare("INSERT INTO quiz_group_members (group_id, user_id) VALUES (?, ?)").run(id, userId);
  return { ok: true, group: groupDetails(id, userId) };
}

function joinGroup(userId, code) {
  const group = db.prepare("SELECT id FROM quiz_groups WHERE code = ?").get(String(code || "").trim().toUpperCase());
  if (!group) return { ok: false, status: 404, message: "Aucun groupe ne correspond à ce code." };
  db.prepare("INSERT OR IGNORE INTO quiz_group_members (group_id, user_id) VALUES (?, ?)").run(group.id, userId);
  return { ok: true, group: groupDetails(group.id, userId) };
}

function leaveGroup(userId, groupId) {
  db.prepare("DELETE FROM quiz_group_members WHERE group_id = ? AND user_id = ?").run(groupId, userId);
  const left = db.prepare("SELECT COUNT(*) AS total FROM quiz_group_members WHERE group_id = ?").get(groupId).total;
  if (!left) db.prepare("DELETE FROM quiz_groups WHERE id = ?").run(groupId);
  return { ok: true };
}

function groupDetails(groupId, userId) {
  const group = db.prepare("SELECT id, code, name, owner_id FROM quiz_groups WHERE id = ?").get(groupId);
  if (!group) return null;
  const members = db.prepare("SELECT user_id FROM quiz_group_members WHERE group_id = ?").all(groupId).map(row => row.user_id);
  return { id: group.id, code: group.code, name: group.name, is_owner: group.owner_id === userId, members: ranking(members, userId) };
}

function myGroups(userId) {
  return db.prepare("SELECT group_id FROM quiz_group_members WHERE user_id = ? ORDER BY joined_at")
    .all(userId).map(row => groupDetails(row.group_id, userId)).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Frise panafricaine
// ---------------------------------------------------------------------------

const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 };
function romanToNumber(text) {
  let total = 0;
  for (let index = 0; index < text.length; index++) {
    const value = ROMAN[text[index]];
    const next = ROMAN[text[index + 1]] || 0;
    total += value < next ? -value : value;
  }
  return total;
}

// Transforme un repère écrit (« Vers 1235 », « Fin du XIXe siècle »,
// « IIIe siècle av. J.-C. », « Années 1960 »…) en année approximative pour
// ordonner la frise. Les repères sans date (« Chaque année », « Aujourd'hui »)
// sont ignorés.
function approximateYear(text) {
  const value = String(text || "");
  const lower = value.toLowerCase();
  if (/chaque|aujourd|depuis|temps anciens|temps géologiques|siècles passés|siècles suivants|il y a plusieurs|années récentes|jusqu'à|tous les/.test(lower)) return null;
  const beforeChrist = /av\.? ?j\.?-?c/.test(lower);
  const millions = /(\d+(?:[.,]\d+)?)\s*millions? d'années/.exec(lower);
  if (millions) return -Math.round(Number(millions[1].replace(",", ".")) * 1e6);
  const decade = /années (\d{4})/.exec(lower);
  if (decade) {
    const start = Number(decade[1]);
    if (/début des/.test(lower)) return start + 2;
    if (/fin des/.test(lower)) return start + 8;
    return start + 5;
  }
  const year = /\b(\d{3,4})\b/.exec(value);
  if (year) return beforeChrist ? -Number(year[1]) : Number(year[1]);
  const century = /\b([IVXLC]+)e\b/.exec(value);
  if (century) {
    const number = romanToNumber(century[1]);
    let offset = 50;
    if (/début/.test(lower)) offset = 10;
    else if (/première moitié/.test(lower)) offset = 25;
    else if (/milieu/.test(lower)) offset = 50;
    else if (/seconde moitié/.test(lower)) offset = 75;
    else if (/fin/.test(lower)) offset = 85;
    else if (/avant/.test(lower)) offset = 0;
    return beforeChrist ? -((number - 1) * 100 + (100 - offset)) : (number - 1) * 100 + offset;
  }
  return null;
}

function timeline() {
  const currentYear = new Date().getFullYear();
  const sites = db.prepare(`
    SELECT s.id, s.slug, s.name, s.extras, c.name AS country, c.flag, cat.slug AS category
    FROM sites s JOIN countries c ON c.id = s.country_id JOIN categories cat ON cat.id = s.category_id
    WHERE s.status = 'published'
  `).all();
  const events = [];
  sites.forEach(site => {
    parseExtras(site.extras).chronologie.forEach(item => {
      const year = approximateYear(item.date);
      if (year === null || year > currentYear) return;
      events.push({ year, date: item.date, event: item.event, site_id: site.id, slug: site.slug, site_name: site.name, country: site.country, flag: site.flag, category: site.category });
    });
  });
  return events.sort((a, b) => a.year - b.year || a.country.localeCompare(b.country));
}

module.exports = {
  questionPool, dailyIndex, answerDaily, dailyStats, leaderboard,
  createGroup, joinGroup, leaveGroup, myGroups, groupDetails,
  approximateYear, timeline
};
