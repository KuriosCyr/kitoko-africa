// Mode hors connexion de Kitoko Afrika.
//
// Toutes les lectures de l'API (GET) passent par ici :
// - la réponse du serveur est enregistrée sur l'appareil ;
// - sans réseau (ou si le serveur gratuit met trop de temps à se réveiller),
//   la dernière version enregistrée est affichée ;
// - dans l'application mobile, un instantané des contenus et des photos est
//   livré avec l'APK (offline/data.json, offline/media/), pour que tout
//   s'affiche même au tout premier lancement sans connexion.
// Dès que le réseau revient, les données sont rechargées automatiquement.
(function(){
  const config = window.KITOKO_CONFIG || {};
  const apiBase = `${(config.apiOrigin || "").replace(/\/$/, "")}/api`;
  const nativeFetch = window.fetch.bind(window);
  const PREFIX = "kitoko_cache:";
  // Au-delà, on affiche le contenu enregistré (le serveur gratuit peut mettre
  // jusqu'à une minute à se réveiller) et la mise à jour se fait en arrière-plan.
  const TIMEOUT_WITH_CACHE = 7000;
  // Pas de cache pour l'administration ni pour les fichiers non JSON.
  const NOT_CACHED = /^\/(admin|auth\/logout)(\/|$)|\.svg$/;

  let bundle = { responses: {}, media: [] };
  let bundleMedia = new Set();
  let offline = false;
  let retryTimer = null;
  const listeners = [];

  const bundleReady = nativeFetch("offline/data.json")
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if(data && data.responses){
        bundle = data;
        bundleMedia = new Set(data.media || []);
      }
    })
    .catch(() => {});

  function apiPath(url){
    const value = typeof url === "string" ? url : url && url.url;
    if(!value || !value.startsWith(apiBase + "/")) return null;
    return value.slice(apiBase.length);
  }

  function authKey(options){
    const headers = options && options.headers;
    const auth = headers && (headers.Authorization || headers.authorization || (typeof headers.get === "function" && headers.get("Authorization")));
    return auth ? `u${String(auth).slice(-10)}:` : "";
  }

  function readCache(key){
    try { return localStorage.getItem(PREFIX + key); } catch(error) { return null; }
  }

  function writeCache(key, body){
    try { localStorage.setItem(PREFIX + key, body); }
    catch(error) {
      // Stockage plein : on libère les fiches détaillées avant de réessayer.
      try {
        Object.keys(localStorage).filter(item => item.startsWith(PREFIX) && /\/sites\/\d+/.test(item)).forEach(item => localStorage.removeItem(item));
        localStorage.setItem(PREFIX + key, body);
      } catch(ignored) { /* tant pis : la page reste utilisable en ligne */ }
    }
  }

  function cachedResponse(key, path){
    const body = readCache(key) ?? (key === path && bundle.responses[path] !== undefined ? JSON.stringify(bundle.responses[path]) : null);
    if(body === null) return null;
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json", "X-Kitoko-Offline": "1" } });
  }

  async function networkAndStore(input, options, key){
    const response = await nativeFetch(input, options);
    if(response.ok && (response.headers.get("content-type") || "").includes("json")){
      response.clone().text().then(body => writeCache(key, body)).catch(() => {});
    }
    return response;
  }

  window.fetch = async function(input, options){
    const method = ((options && options.method) || (input && input.method) || "GET").toUpperCase();
    const path = apiPath(input);
    if(method !== "GET" || !path || NOT_CACHED.test(path)) return nativeFetch(input, options);

    await bundleReady;
    const key = authKey(options) + path;
    const network = networkAndStore(input, options, key);
    const hasCache = readCache(key) !== null || (key === path && bundle.responses[path] !== undefined);

    if(!hasCache){
      try {
        const response = await network;
        setOffline(false);
        return response;
      } catch(error) {
        setOffline(true);
        throw error;
      }
    }

    const timeout = new Promise(resolve => setTimeout(() => resolve("timeout"), TIMEOUT_WITH_CACHE));
    const result = await Promise.race([network.catch(() => "error"), timeout]);
    if(result !== "error" && result !== "timeout"){
      setOffline(false);
      return result;
    }
    network.catch(() => {});
    setOffline(true);
    return cachedResponse(key, path);
  };

  function setOffline(value){
    if(offline === value) return;
    offline = value;
    renderBanner();
    clearInterval(retryTimer);
    retryTimer = value ? setInterval(checkConnection, 15000) : null;
  }

  function renderBanner(){
    let banner = document.getElementById("offline-banner");
    if(!offline){ banner?.remove(); return; }
    if(banner || !document.body) return;
    banner = document.createElement("div");
    banner.id = "offline-banner";
    banner.className = "offline-banner";
    banner.setAttribute("role", "status");
    banner.textContent = "Hors connexion : contenu enregistré sur l'appareil. Mise à jour automatique au retour du réseau.";
    document.body.appendChild(banner);
    // Message discret : il disparaît après quelques secondes.
    setTimeout(() => banner.remove(), 6000);
  }

  async function checkConnection(){
    if(navigator.onLine === false) return;
    try {
      const response = await nativeFetch(`${apiBase}/health`, { cache: "no-store" });
      if(!response.ok) return;
    } catch(error) { return; }
    setOffline(false);
    listeners.forEach(listener => { try { listener(); } catch(error) { console.warn(error); } });
  }

  window.addEventListener("online", checkConnection);
  window.addEventListener("offline", () => setOffline(true));
  document.addEventListener("visibilitychange", () => { if(!document.hidden && offline) checkConnection(); });

  window.KitokoOffline = {
    ready: bundleReady,
    isOffline: () => offline,
    // Appelé quand la connexion revient, pour recharger l'écran.
    onReconnect: listener => listeners.push(listener),
    // Photos livrées avec l'application : affichées sans réseau.
    localMedia(url){
      const match = /^\/uploads\/([^/?#]+)$/.exec(url || "");
      return match && bundleMedia.has(decodeURIComponent(match[1])) ? `offline/media/${match[1]}` : null;
    },
    clearUserData(){
      try { Object.keys(localStorage).filter(item => item.startsWith(PREFIX + "u")).forEach(item => localStorage.removeItem(item)); } catch(error) { /* rien */ }
    }
  };
})();
