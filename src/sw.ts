/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "todo-app-v1";

// File yang di-cache saat install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// ── INSTALL ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── ACTIVATE ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH (Cache First) ──
self.addEventListener("fetch", (event) => {
  // Skip non-GET & chrome-extension request
  if (event.request.method !== "GET" || event.request.url.startsWith("chrome-extension")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html") as Promise<Response>);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SCHEDULE_NOTIFICATION") {
    const { body, delay } = event.data.payload;

    setTimeout(() => {
      self.registration.showNotification('Ada notifikasi',{
        body,
        icon: "/icons/icon-192x192.png",
        tag: `todo-${Date.now()}`,
      });
    }, delay);
  }
});