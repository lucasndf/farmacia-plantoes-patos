// ======================================================
// Service Worker — Farmácia de Plantão Patos-PB
// (APENAS SITE PÚBLICO)
// ======================================================

const CACHE_NAME = "plantoes-patos-v3";

// ⚠️ SOMENTE arquivos públicos
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
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ------------------------------------------------------
// FETCH
// ❗ IGNORA ADMIN / LOGIN / FIREBASE
// ------------------------------------------------------
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ❌ NÃO cachear área administrativa
  if (
    url.pathname.includes("painel") ||
    url.pathname.includes("admin") ||
    url.pathname.includes("login") ||
    url.pathname.includes("firebase")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
