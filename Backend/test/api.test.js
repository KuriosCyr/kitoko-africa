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
  assert.equal(data.data.length, 37);
  const ids = data.data.map(site => site.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(data.data.some(site => site.featured === true));
  assert.ok(data.data.some(site => site.sources.length > 0));
  assert.ok(data.data.every(site => "media_url" in site && "owner_id" in site));
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
