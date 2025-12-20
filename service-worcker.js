// ======================================================
// Service Worker — Farmácia de Plantão Patos-PB
// (APENAS SITE PÚBLICO / SEM ADMIN)
// ======================================================

const CACHE_NAME = "plantoes-patos-v3";

// ✅ SOMENTE arquivos do site público
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./data.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

// ------------------------------------------------------
// INSTALL
// ------------------------------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ------------------------------------------------------
// ACTIVATE
// ------------------------------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ------------------------------------------------------
// FETCH
// ❗ IGNORA ADMIN / LOGIN / FIREBASE / AUTH
// ------------------------------------------------------
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 🚫 NÃO interceptar nada administrativo ou Firebase
  if (
    url.pathname.includes("admin") ||
    url.pathname.includes("painel") ||
    url.pathname.includes("login") ||
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis")
  ) {
    return;
  }

  // ✅ Cache-first apenas para o site público
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
