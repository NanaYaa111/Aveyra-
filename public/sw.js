/* Aveyra service worker — offline-first (Constitution Part 2 §5).
 *
 * Precaches the app shell so every destination opens with no network. HTML
 * navigations are network-first (so a fresh deploy is picked up immediately),
 * falling back to the cached shell when offline. Hashed static assets are
 * cache-first (they are immutable). Bump CACHE to force a full refresh.
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

function cachePut(request, response) {
  if (response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Navigations: network-first so a fresh deploy is served immediately; fall
  // back to the cached page (then the start page) when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => cachePut(request, response))
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  // Everything else (hashed static assets, icons, manifest): cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => cachePut(request, response));
    }),
  );
});
