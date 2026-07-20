/* Aveyra service worker — offline-first (Constitution Part 2 §5).
 *
 * Precaches the app shell so every destination opens with no network, then
 * serves same-origin GETs cache-first with a network fallback. Navigations
 * fall back to the cached start page when offline. Bump CACHE to ship updates.
 */
const CACHE = 'aveyra-v1';
const SHELL = [
  '/',
  '/today/',
  '/story/',
  '/write/',
  '/settings/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/maskable.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Best-effort precache: never fail install if one asset 404s in dev.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') return caches.match('/');
          return undefined;
        });
    }),
  );
});
