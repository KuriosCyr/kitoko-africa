// Service worker Kitoko Afrika : mode hors connexion.
// - L'application (pages, styles, scripts, carte) est mise en cache à l'installation.
// - Les données (API) passent d'abord par le réseau ; hors connexion, la
//   dernière version consultée est utilisée.
// - Les photos et médias publiés sont gardés en cache après consultation.
// Les requêtes d'écriture (tampons, contributions…) ne sont jamais mises en cache.

const VERSION = "kitoko-v11";
const APP_CACHE = `${VERSION}-app`;
const DATA_CACHE = `${VERSION}-data`;
const MEDIA_CACHE = `${VERSION}-media`;

const APP_SHELL = [
  "./",
  "index.html",
  "style.css",
  "themes/indigo.css",
  "fonts/cormorant-garamond-latin-600-normal.woff2",
  "fonts/cormorant-garamond-latin-700-normal.woff2",
  "fonts/source-sans-3-latin-400-normal.woff2",
  "fonts/source-sans-3-latin-600-normal.woff2",
  "fonts/source-sans-3-latin-700-normal.woff2",
  "app.js",
  "passport.js",
  "site-admin.js",
  "explore.js",
  "offline.js",
  "features.js",
  "ui.js",
  "config.js",
  "confidentialite.html",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "vendor/d3-array.min.js",
  "vendor/d3-geo.min.js",
  "vendor/topojson-client.min.js",
  "vendor/africa-50m.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => !key.startsWith(VERSION)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, cacheName){
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if(response.ok) cache.put(request, response.clone());
    return response;
  } catch(error) {
    const cached = await cache.match(request, { ignoreSearch: false });
    if(cached) return cached;
    throw error;
  }
}

async function cacheFirst(request, cacheName){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if(cached) return cached;
  const response = await fetch(request);
  if(response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if(request.method !== "GET") return;
  const url = new URL(request.url);

  // Données personnelles (passeport, profil, administration) : jamais en cache.
  // (Dans l'application mobile, l'API est sur un autre domaine que la page.)
  if(url.pathname.startsWith("/api/")){
    const publicData = /^\/api\/(sites|countries|themes|categories|itineraries|partners)(\/|$)/.test(url.pathname) && !request.headers.has("Authorization");
    if(publicData) event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  if(url.pathname.startsWith("/uploads/")){
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
    return;
  }

  // Navigation (y compris les liens de QR code /?site=…) : page de l'application.
  if(request.mode === "navigate"){
    event.respondWith(fetch(request).catch(() => caches.match("index.html")));
    return;
  }

  if(url.origin === self.location.origin){
    event.respondWith(networkFirst(request, APP_CACHE));
    return;
  }

  // Drapeaux externes : conservés après le premier chargement.
  if(/flagcdn\.com/.test(url.hostname)){
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
  }
});
