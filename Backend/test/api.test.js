const test = require("node:test");
const assert = require("node:assert/strict");

const API = process.env.API_BASE || "http://localhost:3000/api";

async function request(path, options) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json();
  return { response, data };
}

test("API health is available", async () => {
  const { response, data } = await request("/health");
  assert.equal(response.status, 200);
  assert.equal(data.success, true);
});

test("admin authentication survives API session lookup", async () => {
  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@kitokoafrika.org", password: "admin123" })
  });
  assert.equal(login.response.status, 200);
  assert.equal(login.data.user.role, "admin");

  const profile = await request("/auth/me", {
    headers: { Authorization: `Bearer ${login.data.token}` }
  });
  assert.equal(profile.response.status, 200);
  assert.equal(profile.data.user.email, "admin@kitokoafrika.org");
});

test("protected resources reject anonymous access", async () => {
  const favorites = await request("/favorites");
  const contributions = await request("/contributions/mine");
  assert.equal(favorites.response.status, 401);
  assert.equal(contributions.response.status, 401);
});

test("admin moderation endpoint is protected by role", async () => {
  const { response } = await request("/admin/contributions");
  assert.equal(response.status, 401);
});

test("public sites include media metadata and search data", async () => {
  const { response, data } = await request("/sites");
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.every(site => "media_url" in site && "region" in site));
});

test("authenticated user can read notifications", async () => {
  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@kitokoafrika.org", password: "admin123" })
  });
  const notifications = await request("/auth/notifications", {
    headers: { Authorization: `Bearer ${login.data.token}` }
  });
  assert.equal(notifications.response.status, 200);
  assert.ok(Array.isArray(notifications.data.data));
});
