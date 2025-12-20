// sw-public.js
// ======================================================
// Service Worker — Farmácia de Plantão Patos-PB
// APENAS SITE PÚBLICO
// ======================================================

const CACHE_NAME = "plantoes-public-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./data.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ❌ NÃO controlar admin
  if (
    url.pathname.includes("painel") ||
    url.pathname.includes("login") ||
    url.pathname.includes("admin")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
