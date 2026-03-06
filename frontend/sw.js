const SW_VERSION = "voicesafe-v1.0.0";
const STATIC_CACHE = `${SW_VERSION}-static`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;
const IMAGE_CACHE = `${SW_VERSION}-images`;

// App shell files
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/config.js",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html",

  // i18n
  "/i18n/en.json",
  "/i18n/sk.json",
  "/i18n/de.json",
  "/i18n/fr.json",
  "/i18n/es.json",
  "/i18n/it.json",
  "/i18n/pt.json",
  "/i18n/nl.json",
  "/i18n/pl.json",
  "/i18n/hu.json",
  "/i18n/ro.json",
  "/i18n/ja.json",
  "/i18n/ko.json",
  "/i18n/zh.json",
  "/i18n/hi.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
        } catch (err) {
          // some optional files may not exist yet
          console.warn("[SW] Failed to precache:", url, err);
        }
      }
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (
            key !== STATIC_CACHE &&
            key !== RUNTIME_CACHE &&
            key !== IMAGE_CACHE
          ) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Never cache browser extensions or non-http(s)
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // API / backend / AI calls -> network only
  if (
    url.pathname.startsWith("/upload") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/me") ||
    url.pathname.startsWith("/health") ||
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("onrender.com")
  ) {
    event.respondWith(networkOnly(request));
    return;
  }

  // HTML navigation -> network first, fallback to cache/offline
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  // Images -> cache first
  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // CSS / JS / fonts / manifest / json -> stale while revalidate
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // Default -> stale while revalidate
  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

// =========================
// Strategies
// =========================

async function networkOnly(request) {
  return fetch(request);
}

async function networkFirstPage(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;

    const staticCache = await caches.open(STATIC_CACHE);
    const offline = await staticCache.match("/offline.html");
    if (offline) return offline;

    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    return new Response("", {
      status: 504,
      statusText: "Image unavailable"
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((fresh) => {
      cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => null);

  return cached || fetchPromise || new Response("", { status: 504 });
}