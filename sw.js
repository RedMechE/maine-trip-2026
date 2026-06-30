const CACHE_NAME = 'maine-trip-2026-v4';
const ASSETS = [
  './Maine_July4_2026.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Only intercept same-origin requests (our own HTML/manifest).
  // Let all cross-origin requests (like the weather API) go straight to network, untouched.
  if (url.origin !== self.location.origin) {
    return; // do not call event.respondWith — browser handles it natively
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
