// Tests d'intégration de l'API. Chaque exécution démarre son propre serveur
// sur une base SQLite et un dossier d'envoi temporaires : aucune donnée
// réelle n'est lue ni modifiée, et aucun serveur n'a besoin d'être lancé avant.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kitoko-test-"));
process.env.NODE_ENV = "test";
process.env.DB_PATH = path.join(tempDir, "test.db");
process.env.UPLOAD_DIR = path.join(tempDir, "uploads");
process.env.ADMIN_EMAIL = "admin@test.local";
process.env.ADMIN_PASSWORD = "un-mot-de-passe-de-test";

const sharp = require("sharp");
const { start } = require("../server");
const { seed } = require("../db/seed");

let server;
let baseUrl;

test.before(async () => {
  seed({ log: () => {} });
  server = start(0);
  await new Promise(resolve => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
  server?.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

async function api(pathname, { token, json, form, method } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body;
  if (json) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form;
  }
  const response = await fetch(`${baseUrl}${pathname}`, { method: method || (body ? "POST" : "GET"), headers, body });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json() : await response.arrayBuffer();
  return { status: response.status, data, headers: response.headers };
}

let userCounter = 0;
async function signup(name = "Contributeur") {
  userCounter++;
  const { status, data } = await api("/api/auth/signup", {
    json: { name, email: `user${userCounter}-${Date.now()}@test.local`, password: "motdepasse-solide" }
  });
  assert.equal(status, 200);
  return data;
}

async function adminLogin() {
  const { status, data } = await api("/api/auth/login", {
    json: { email: "admin@test.local", password: "un-mot-de-passe-de-test" }
  });
  assert.equal(status, 200);
  return data;
}

async function pngBlob() {
  const buffer = await sharp({ create: { width: 40, height: 30, channels: 3, background: "#b5542c" } }).png().toBuffer();
  return new Blob([buffer], { type: "image/png" });
}

async function submitNewSite(token, overrides = {}) {
  const form = new FormData();
  const fields = { name: "Marché de Dantokpa", country: "Bénin", category: "culturel", description: "Grand marché de Cotonou.", region: "Littoral, Cotonou", ...overrides };
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  form.append("media", await pngBlob(), "photo.png");
  return api("/api/contributions", { token, form });
}

test("la route de santé répond", async () => {
  const { status, data } = await api("/api/health");
  assert.equal(status, 200);
  assert.equal(data.success, true);
});

test("le frontend est servi à la racine", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Kitoko Afrika/);
});

test("les sites publiés sont listés sans doublon, avec sources et mise en avant", async () => {
  const { status, data } = await api("/api/sites");
  assert.equal(status, 200);
  assert.equal(data.data.length, 31);
  assert.ok(data.data.every(site => ["Bénin", "Guinée"].includes(site.country)));
  const ids = data.data.map(site => site.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(data.data.some(site => site.featured === true));
  assert.ok(data.data.some(site => site.sources.length > 0));
  assert.ok(data.data.every(site => "media_url" in site && "owner_id" in site && site.slug));
  assert.ok(data.data.every(site => !("checkin_code" in site)), "le code de visite ne doit jamais être public");
});

test("une fiche s'ouvre par son slug (lien des QR codes) avec thèmes, récits et lieux associés", async () => {
  const { status, data } = await api("/api/sites/porte-du-non-retour");
  assert.equal(status, 200);
  assert.equal(data.data.category, "memoire");
  assert.ok(data.data.themes.some(theme => theme.slug === "memoire-traite"));
  assert.ok(data.data.recits.length >= 1);
  assert.ok(data.data.related.some(site => site.slug === "route-des-esclaves-ouidah"));
  assert.equal(data.data.verification_status, "verifie");
});

test("le lien court d'un QR code redirige vers la fiche", async () => {
  const response = await fetch(`${baseUrl}/s/porte-du-non-retour`, { redirect: "manual" });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "/?site=porte-du-non-retour&scan=1");
});

test("les fiches en brouillon ne sont pas publiques", async () => {
  assert.equal((await api("/api/sites/7")).status, 404);
  const admin = await adminLogin();
  const all = await api("/api/admin/sites", { token: admin.token });
  assert.ok(all.data.data.some(site => site.id === 7 && site.status === "draft"));
});

test("un site inexistant renvoie 404", async () => {
  assert.equal((await api("/api/sites/99999")).status, 404);
  assert.equal((await api("/api/sites/abc")).status, 404);
});

test("les 54 pays sont disponibles avec leur code carte", async () => {
  const { data } = await api("/api/countries");
  assert.equal(data.data.length, 54);
  assert.ok(data.data.every(country => country.map_id));
});

test("l'admin configuré dans l'environnement peut se connecter, admin123 n'existe pas", async () => {
  const admin = await adminLogin();
  assert.equal(admin.user.role, "admin");
  const demo = await api("/api/auth/login", { json: { email: "admin@kitokoafrika.org", password: "admin123" } });
  assert.equal(demo.status, 401);
});

test("l'inscription refuse les mots de passe courts et les e-mails invalides", async () => {
  assert.equal((await api("/api/auth/signup", { json: { name: "A", email: "a@b.co", password: "court" } })).status, 400);
  assert.equal((await api("/api/auth/signup", { json: { name: "A", email: "pas-un-email", password: "motdepasse-solide" } })).status, 400);
});

test("la session fonctionne puis est invalidée à la déconnexion", async () => {
  const user = await signup();
  const me = await api("/api/auth/me", { token: user.token });
  assert.equal(me.status, 200);
  assert.equal((await api("/api/auth/logout", { token: user.token, method: "POST" })).status, 200);
  assert.equal((await api("/api/auth/me", { token: user.token })).status, 401);
});

test("les tentatives de connexion répétées sont bloquées", async () => {
  const email = `bruteforce-${Date.now()}@test.local`;
  let last;
  for (let i = 0; i < 9; i++) {
    last = await api("/api/auth/login", { json: { email, password: "mauvais" } });
  }
  assert.equal(last.status, 429);
});

test("un JSON invalide renvoie une erreur JSON 400", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{mal formé" });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).success, false);
});

test("les ressources protégées refusent les visiteurs anonymes", async () => {
  assert.equal((await api("/api/favorites")).status, 401);
  assert.equal((await api("/api/contributions/mine")).status, 401);
  assert.equal((await api("/api/admin/contributions")).status, 401);
});

test("un utilisateur simple n'a pas accès à la modération", async () => {
  const user = await signup();
  assert.equal((await api("/api/admin/contributions", { token: user.token })).status, 403);
});

test("favoris : ajout, liste et retrait", async () => {
  const user = await signup();
  assert.equal((await api("/api/favorites/1", { token: user.token, method: "POST" })).status, 201);
  assert.deepEqual((await api("/api/favorites", { token: user.token })).data.data, [1]);
  await api("/api/favorites/1", { token: user.token, method: "DELETE" });
  assert.deepEqual((await api("/api/favorites", { token: user.token })).data.data, []);
});

test("une contribution sans média est refusée", async () => {
  const user = await signup();
  const form = new FormData();
  form.append("name", "Sans photo");
  form.append("country", "Bénin");
  form.append("category", "culturel");
  form.append("description", "Test");
  const { status } = await api("/api/contributions", { token: user.token, form });
  assert.equal(status, 400);
});

test("un faux fichier image est refusé et n'enregistre rien", async () => {
  const user = await signup();
  const form = new FormData();
  form.append("name", "Faux fichier");
  form.append("country", "Bénin");
  form.append("category", "culturel");
  form.append("description", "Test");
  form.append("media", new Blob(["<script>alert(1)</script>"], { type: "image/png" }), "piege.png");
  const { status } = await api("/api/contributions", { token: user.token, form });
  assert.equal(status, 422);
  assert.equal((await api("/api/contributions/mine", { token: user.token })).data.data.length, 0);
});

test("parcours complet : contribution privée, modération, publication", async () => {
  const user = await signup("Aïcha");
  const other = await signup("Curieux");
  const admin = await adminLogin();

  const created = await submitNewSite(user.token);
  assert.equal(created.status, 201);

  const mine = await api("/api/contributions/mine", { token: user.token });
  const contribution = mine.data.data[0];
  assert.equal(contribution.status, "pending");
  assert.equal(contribution.region, "Littoral, Cotonou");

  // Le média en attente n'est pas public : seuls l'auteur et l'admin y accèdent.
  const mediaPath = `/api/contributions/media/${contribution.media_id}`;
  assert.equal((await api(mediaPath, { token: user.token })).status, 200);
  assert.equal((await api(mediaPath, { token: admin.token })).status, 200);
  assert.equal((await api(mediaPath, { token: other.token })).status, 404);
  assert.equal((await api(mediaPath)).status, 401);

  const approve = await api(`/api/admin/contributions/${contribution.id}`, { token: admin.token, method: "PATCH", json: { decision: "approved" } });
  assert.equal(approve.status, 200);

  // Une seconde validation ne crée pas de doublon.
  const again = await api(`/api/admin/contributions/${contribution.id}`, { token: admin.token, method: "PATCH", json: { decision: "approved" } });
  assert.equal(again.status, 409);

  const sites = (await api("/api/sites")).data.data.filter(site => site.name === "Marché de Dantokpa");
  assert.equal(sites.length, 1);
  assert.equal(sites[0].owner_id, user.user.id);
  assert.equal(sites[0].region, "Littoral, Cotonou");
  assert.ok(sites[0].media_url);

  // Le média est désormais public.
  const publicMedia = await fetch(`${baseUrl}${sites[0].media_url}`);
  assert.equal(publicMedia.status, 200);
  assert.equal(publicMedia.headers.get("content-type"), "image/webp");

  const notifications = await api("/api/auth/notifications", { token: user.token });
  assert.match(notifications.data.data[0].message, /approuvée/);

  // La suppression d'un site issu d'une contribution fonctionne (elle échouait
  // auparavant à cause de la clé étrangère) et le média redevient privé.
  const removed = await api(`/api/admin/sites/${sites[0].id}`, { token: admin.token, method: "DELETE" });
  assert.equal(removed.status, 200);
  assert.equal((await fetch(`${baseUrl}${sites[0].media_url}`)).status, 404);
});

test("un média rejeté reste privé", async () => {
  const user = await signup();
  const admin = await adminLogin();
  await submitNewSite(user.token, { name: "Site à rejeter" });
  const contribution = (await api("/api/contributions/mine", { token: user.token })).data.data[0];
  await api(`/api/admin/contributions/${contribution.id}`, { token: admin.token, method: "PATCH", json: { decision: "rejected" } });
  const sites = (await api("/api/sites")).data.data;
  assert.ok(!sites.some(site => site.name === "Site à rejeter"));
  const notifications = await api("/api/auth/notifications", { token: user.token });
  assert.match(notifications.data.data[0].message, /rejetée/);
});

test("une suggestion de modification arrive bien en modération", async () => {
  const user = await signup();
  const admin = await adminLogin();
  const sent = await api("/api/contributions", { token: user.token, json: { type: "edit", site_id: 1, description: "La date de fondation est à préciser." } });
  assert.equal(sent.status, 201);

  const pending = await api("/api/admin/contributions?status=pending", { token: admin.token });
  const suggestion = pending.data.data.find(item => item.id === sent.data.data.id);
  assert.equal(suggestion.type, "edit");
  assert.equal(suggestion.target_name, "Palais royaux d'Abomey");

  await api(`/api/admin/contributions/${suggestion.id}`, { token: admin.token, method: "PATCH", json: { decision: "approved" } });
  const notifications = await api("/api/auth/notifications", { token: user.token });
  assert.match(notifications.data.data[0].message, /prise en compte/);
});

test("l'admin crée, modifie et supprime un site avec ses sources", async () => {
  const admin = await adminLogin();
  const created = await api("/api/admin/sites", {
    token: admin.token,
    json: { name: "Chutes de la Lobé", country: "Cameroun", cat: "naturel", sources: "Source A\nSource B", featured: true }
  });
  assert.equal(created.status, 201);
  assert.equal(created.data.data.sources, "Source A ; Source B");
  assert.equal(created.data.data.featured, true);

  const updated = await api(`/api/admin/sites/${created.data.data.id}`, {
    token: admin.token,
    method: "PATCH",
    json: { name: "Chutes de la Lobé", country: "Cameroun", cat: "naturel", sources: "Source C", featured: false }
  });
  assert.equal(updated.data.data.sources, "Source C");
  assert.equal(updated.data.data.featured, false);

  const countries = (await api("/api/countries")).data.data;
  assert.equal(countries.find(country => country.name === "Cameroun").sites_count, 1);

  assert.equal((await api(`/api/admin/sites/${created.data.data.id}`, { token: admin.token, method: "DELETE" })).status, 200);
});

test("le dernier administrateur ne peut pas perdre son rôle", async () => {
  const admin = await adminLogin();
  const self = await api(`/api/admin/users/${admin.user.id}/role`, { token: admin.token, method: "PATCH", json: { role: "user" } });
  assert.equal(self.status, 400);
});

// ---------------------------------------------------------------------------
// Passeport
// ---------------------------------------------------------------------------

const PORTE = { latitude: 6.3244, longitude: 2.0892 };

test("le passeport exige une connexion", async () => {
  assert.equal((await api("/api/passport")).status, 401);
});

test("validation sur place par GPS : refusée trop loin, acceptée dans le rayon", async () => {
  const user = await signup();
  const far = await api("/api/passport/sites/porte-du-non-retour/checkin", { token: user.token, json: { latitude: 6.37, longitude: 2.43, accuracy: 20 } });
  assert.equal(far.status, 403);
  assert.match(far.data.message, /km/);

  const near = await api("/api/passport/sites/porte-du-non-retour/checkin", { token: user.token, json: { ...PORTE, accuracy: 15 } });
  assert.equal(near.status, 201);
  assert.equal(near.data.data.method, "gps");
  assert.ok(near.data.data.badges.some(badge => badge.slug === "premier-tampon"));

  // Un second passage ne crée pas de doublon.
  const again = await api("/api/passport/sites/porte-du-non-retour/checkin", { token: user.token, json: { ...PORTE } });
  assert.equal(again.status, 200);
  assert.equal(again.data.data.created, false);

  const notifications = await api("/api/auth/notifications", { token: user.token });
  assert.ok(notifications.data.data.some(item => /Nouveau badge/.test(item.message)));
});

test("validation sur place par le code du site", async () => {
  const user = await signup();
  const admin = await adminLogin();
  const site = (await api("/api/admin/sites/ganvie", { token: admin.token })).data.data;
  assert.match(site.checkin_code, /^[A-Z2-9]{6}$/);

  const wrong = await api("/api/passport/sites/ganvie/checkin", { token: user.token, json: { code: "XXXXXX" } });
  assert.equal(wrong.status, 400);
  const right = await api("/api/passport/sites/ganvie/checkin", { token: user.token, json: { code: site.checkin_code.toLowerCase() } });
  assert.equal(right.status, 201);
  assert.equal(right.data.data.method, "code");
});

test("quiz : les réponses ne sont pas envoyées avant de répondre, le tampon en ligne est accordé", async () => {
  const user = await signup();
  const status = await api("/api/passport/sites/palais-royaux-abomey", { token: user.token });
  const questions = status.data.data.questions;
  assert.equal(questions.length, 3);
  assert.ok(questions.every(question => !("answer_index" in question)));

  const partial = await api("/api/passport/sites/palais-royaux-abomey/quiz", { token: user.token, json: { answers: { [questions[0].id]: 1 } } });
  assert.equal(partial.data.data.completed, false);
  assert.equal(partial.data.data.results[0].correct, true);

  const rest = await api("/api/passport/sites/palais-royaux-abomey/quiz", { token: user.token, json: { answers: { [questions[1].id]: 2, [questions[2].id]: 2 } } });
  assert.equal(rest.data.data.completed, true);
  assert.equal(rest.data.data.stamp_created, true);
  assert.equal(rest.data.data.results[0].correct, false, "une mauvaise réponse est corrigée…");
  assert.ok(rest.data.data.results[0].explanation, "…avec une explication");

  const after = await api("/api/passport/sites/palais-royaux-abomey", { token: user.token });
  assert.ok(after.data.data.online);
  assert.equal(after.data.data.onsite, null);
});

test("le résumé du passeport compte les pays, catégories, thèmes et badges", async () => {
  const user = await signup();
  await api("/api/passport/sites/porte-du-non-retour/checkin", { token: user.token, json: { ...PORTE } });
  const passport = (await api("/api/passport", { token: user.token })).data.data;

  assert.equal(passport.totals.sites, 31);
  assert.equal(passport.totals.visited, 1);
  const benin = passport.countries.find(country => country.label === "Bénin");
  assert.equal(benin.visited, 1);
  assert.equal(benin.total, 17);
  assert.equal(passport.categories.find(category => category.key === "memoire").discovered, 1);
  assert.equal(passport.themes.find(theme => theme.key === "memoire-traite").discovered, 1);

  const explorer = passport.badges.find(badge => badge.slug === "explorateur-Bénin");
  assert.equal(explorer.name, "Explorateur du patrimoine béninois");
  assert.equal(explorer.progress, 1);
  assert.equal(explorer.target, 5);
  assert.ok(passport.badges.some(badge => badge.slug === "decouvreur-ouest-africain"));
});

test("un tampon en ligne ne compte pas pour les badges « sur place »", async () => {
  const user = await signup();
  const questions = (await api("/api/passport/sites/ganvie", { token: user.token })).data.data.questions;
  await api("/api/passport/sites/ganvie/quiz", { token: user.token, json: { answers: Object.fromEntries(questions.map(question => [question.id, 0])) } });
  const badges = (await api("/api/passport", { token: user.token })).data.data.badges;
  assert.equal(badges.find(badge => badge.slug === "explorateur-Bénin").progress, 0);
  assert.equal(badges.find(badge => badge.slug === "connaisseur-Bénin").progress, 1);
});

// ---------------------------------------------------------------------------
// Administration : QR codes, quiz, récits, galerie
// ---------------------------------------------------------------------------

test("l'admin obtient le QR code d'un site", async () => {
  const admin = await adminLogin();
  const response = await fetch(`${baseUrl}/api/admin/sites/porte-du-non-retour/qr.svg`, { headers: { Authorization: `Bearer ${admin.token}` } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/svg+xml; charset=utf-8");
  assert.match(response.headers.get("x-site-url"), /\/s\/porte-du-non-retour$/);
  assert.match(await response.text(), /<svg/);
});

test("l'admin gère les questions de quiz et les récits d'un site", async () => {
  const admin = await adminLogin();
  const invalid = await api("/api/admin/sites/chutes-de-kota/quiz", { token: admin.token, json: { question: "?", choices: ["A"], answer_index: 0 } });
  assert.equal(invalid.status, 400);

  const created = await api("/api/admin/sites/chutes-de-kota/quiz", { token: admin.token, json: { question: "Question test ?", choices: ["A", "B", "C"], answer_index: 2, explanation: "Parce que." } });
  assert.equal(created.status, 201);
  const site = (await api("/api/admin/sites/chutes-de-kota", { token: admin.token })).data.data;
  assert.ok(site.quiz.some(question => question.question === "Question test ?" && question.answer_index === 2));
  assert.equal((await api(`/api/admin/quiz/${created.data.data.id}`, { token: admin.token, method: "DELETE" })).status, 200);

  const recit = await api("/api/admin/sites/chutes-de-kota/recits", { token: admin.token, json: { title: "Un récit", body: "Texte.", nature: "tradition_orale" } });
  assert.equal(recit.status, 201);
  const detail = (await api("/api/sites/chutes-de-kota")).data.data;
  assert.ok(detail.recits.some(item => item.title === "Un récit"));
  assert.equal((await api(`/api/admin/recits/${recit.data.data.id}`, { token: admin.token, method: "DELETE" })).status, 200);
});

test("l'admin ajoute une photo à la galerie et enregistre les coordonnées", async () => {
  const admin = await adminLogin();
  const form = new FormData();
  form.append("media", await pngBlob(), "galerie.png");
  form.append("title", "Vue du site");
  form.append("author", "Pôle Documentation");
  const upload = await api("/api/admin/sites/tata-somba-boukoumbe/media", { token: admin.token, form });
  assert.equal(upload.status, 201);

  const detail = (await api("/api/sites/tata-somba-boukoumbe")).data.data;
  assert.equal(detail.media.length, 1);
  assert.equal(detail.media[0].author, "Pôle Documentation");
  assert.equal((await fetch(`${baseUrl}${detail.media[0].url}`)).status, 200);

  const site = (await api("/api/admin/sites/tata-somba-boukoumbe", { token: admin.token })).data.data;
  const saved = await api(`/api/admin/sites/${site.id}`, {
    token: admin.token, method: "PATCH",
    json: { ...site, cat: site.category, latitude: "10.2", longitude: "1.12", checkin_radius_m: 800, themes: ["architecture"], verification_status: "a_verifier" }
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.data.latitude, 10.2);
  assert.equal(saved.data.data.verification_status, "a_verifier");
  assert.deepEqual(saved.data.data.themes, ["architecture"]);

  const bad = await api(`/api/admin/sites/${site.id}`, { token: admin.token, method: "PATCH", json: { ...site, cat: site.category, latitude: "abc", longitude: "1" } });
  assert.equal(bad.status, 400);
});

// ---------------------------------------------------------------------------
// Nouveaux types de contribution
// ---------------------------------------------------------------------------

async function audioBlob() {
  // En-tête MP3 minimal (balise ID3) suivi de données.
  return new Blob([Buffer.concat([Buffer.from("ID3"), Buffer.alloc(200, 1)])], { type: "audio/mpeg" });
}

test("un témoignage audio approuvé apparaît dans la fiche du site", async () => {
  const user = await signup("Grand-mère Adjoa");
  const admin = await adminLogin();
  const form = new FormData();
  form.append("type", "recit");
  form.append("site_id", "2");
  form.append("name", "Mon enfance à Ganvié");
  form.append("description", "Je me souviens des pirogues du marché…");
  form.append("nature", "temoignage");
  form.append("media", await audioBlob(), "souvenir.mp3");
  const sent = await api("/api/contributions", { token: user.token, form });
  assert.equal(sent.status, 201);
  assert.equal(sent.data.data.media, true);

  await api(`/api/admin/contributions/${sent.data.data.id}`, { token: admin.token, method: "PATCH", json: { decision: "approved" } });
  const detail = (await api("/api/sites/ganvie")).data.data;
  const recit = detail.recits.find(item => item.title === "Mon enfance à Ganvié");
  assert.ok(recit);
  assert.equal(recit.nature, "temoignage");
  assert.equal(recit.author_name, "Grand-mère Adjoa");
  assert.equal(recit.media_type, "audio");
  assert.equal((await fetch(`${baseUrl}${recit.media_url}`)).status, 200);
});

test("une photo proposée pour un site rejoint sa galerie après validation", async () => {
  const user = await signup();
  const admin = await adminLogin();
  const form = new FormData();
  form.append("type", "media");
  form.append("site_id", "3");
  form.append("credit_name", "Kossi");
  form.append("media", await pngBlob(), "foret.png");
  const sent = await api("/api/contributions", { token: user.token, form });
  assert.equal(sent.status, 201);
  assert.equal((await api("/api/sites/3")).data.data.media.length, 0);

  await api(`/api/admin/contributions/${sent.data.data.id}`, { token: admin.token, method: "PATCH", json: { decision: "approved" } });
  const media = (await api("/api/sites/3")).data.data.media;
  assert.equal(media.length, 1);
  assert.equal(media[0].author, "Kossi");
});

test("un faux fichier audio est refusé", async () => {
  const user = await signup();
  const form = new FormData();
  form.append("type", "recit");
  form.append("site_id", "2");
  form.append("name", "Faux");
  form.append("description", "Texte");
  form.append("media", new Blob(["pas du son"], { type: "audio/mpeg" }), "faux.mp3");
  assert.equal((await api("/api/contributions", { token: user.token, form })).status, 422);
});

// ---------------------------------------------------------------------------
// Itinéraires, partenaires, compte
// ---------------------------------------------------------------------------

test("les circuits sont listés avec leurs étapes ordonnées et leur distance", async () => {
  const { data } = await api("/api/itineraries");
  assert.equal(data.data.length, 7);
  const ouidah = data.data.find(item => item.slug === "ouidah-route-de-la-memoire");
  assert.deepEqual(ouidah.stops.map(stop => stop.slug), ["fort-portugais-ouidah", "temple-des-pythons-ouidah", "foret-sacree-kpasse", "route-des-esclaves-ouidah", "porte-du-non-retour"]);
  assert.ok(ouidah.distance_km >= 1 && ouidah.distance_km < 20);
});

test("compléter les étapes d'un circuit donne le badge du circuit", async () => {
  const user = await signup();
  const admin = await adminLogin();
  const circuit = (await api("/api/itineraries")).data.data.find(item => item.slug === "atacora-nature-et-architecture");
  for (const stop of circuit.stops) {
    const code = (await api(`/api/admin/sites/${stop.slug}`, { token: admin.token })).data.data.checkin_code;
    await api(`/api/passport/sites/${stop.slug}/checkin`, { token: user.token, json: { code } });
  }
  const badge = (await api("/api/passport", { token: user.token })).data.data.badges.find(item => item.slug === `circuit-${circuit.slug}`);
  assert.equal(badge.earned, true);
});

test("partenaires : candidature, validation, affichage sur la fiche, tampon économique", async () => {
  const guide = await signup("Kossi le guide");
  const visitor = await signup("Visiteuse");
  const admin = await adminLogin();

  const noCharter = await api("/api/partners", { token: guide.token, json: { name: "Guides de Ouidah", type: "guide", country: "Bénin", phone: "+229 00 00 00 00" } });
  assert.equal(noCharter.status, 400);
  const noContact = await api("/api/partners", { token: guide.token, json: { name: "X", type: "guide", country: "Bénin", charter: true } });
  assert.equal(noContact.status, 400);

  const applied = await api("/api/partners", { token: guide.token, json: { name: "Guides de Ouidah", type: "guide", country: "Bénin", site_id: 102, phone: "+229 00 00 00 00", website: "exemple.org", charter: true } });
  assert.equal(applied.status, 201);
  assert.equal((await api("/api/partners")).data.data.length, 0, "une candidature n'est pas publique avant validation");
  assert.ok((await api("/api/auth/notifications", { token: admin.token })).data.data.some(item => /partenariat/.test(item.message)));

  const pending = (await api("/api/admin/partners", { token: admin.token })).data.data.find(item => item.id === applied.data.data.id);
  assert.equal(pending.status, "pending");
  const approved = await api(`/api/admin/partners/${pending.id}`, { token: admin.token, method: "PATCH", json: { ...pending, status: "published" } });
  assert.equal(approved.status, 200);

  const mine = (await api("/api/partners/mine", { token: guide.token })).data.data[0];
  assert.equal(mine.status, "published");
  assert.equal(mine.checkin_code, pending.checkin_code);

  const publicList = (await api("/api/partners?country=Bénin")).data.data;
  assert.equal(publicList.length, 1);
  assert.equal(publicList[0].website, "https://exemple.org");
  assert.ok(!("checkin_code" in publicList[0]), "le code du partenaire n'est jamais public");
  assert.equal((await api("/api/sites/route-des-esclaves-ouidah")).data.data.partners.length, 1);

  const wrong = await api(`/api/passport/partners/${pending.id}/checkin`, { token: visitor.token, json: { code: "NOPE" } });
  assert.equal(wrong.status, 400);
  const stamp = await api(`/api/passport/partners/${pending.id}/checkin`, { token: visitor.token, json: { code: pending.checkin_code } });
  assert.equal(stamp.status, 201);
  const passport = (await api("/api/passport", { token: visitor.token })).data.data;
  assert.equal(passport.totals.partners, 1);
  assert.equal(passport.badges.find(item => item.slug === "soutien-economie-locale").progress, 1);
});

test("un utilisateur peut supprimer son compte (exigence des stores)", async () => {
  const user = await signup();
  await api("/api/favorites/1", { token: user.token, method: "POST" });
  const wrong = await api("/api/auth/me", { token: user.token, method: "DELETE", json: { password: "faux-mot-de-passe" } });
  assert.equal(wrong.status, 401);
  const deleted = await api("/api/auth/me", { token: user.token, method: "DELETE", json: { password: "motdepasse-solide" } });
  assert.equal(deleted.status, 200);
  assert.equal((await api("/api/auth/me", { token: user.token })).status, 401);
});

test("un administrateur ne peut pas supprimer son compte directement", async () => {
  const admin = await adminLogin();
  const response = await api("/api/auth/me", { token: admin.token, method: "DELETE", json: { password: "un-mot-de-passe-de-test" } });
  assert.equal(response.status, 400);
});

test("les fichiers de liens profonds répondent 404 tant qu'ils ne sont pas configurés", async () => {
  assert.equal((await fetch(`${baseUrl}/.well-known/assetlinks.json`)).status, 404);
});
