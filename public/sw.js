/* Aveyra service worker — offline-first (Constitution Part 2 §5).
 *
 * Precaches the app shell so every destination opens with no network. HTML
 * navigations are stale-while-revalidate: the cached page is served instantly
 * (offline-safe — its cached subresources already match) while a background
 * fetch refreshes the cache for the next visit, so a deploy is picked up
 * without a manual CACHE bump. Hashed static assets are cache-first (they are
 * immutable). Bump CACHE to force an immediate full refresh.
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

// Last-resort response so a navigation never resolves to `undefined`.
function offlineResponse() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
      '<body style="font-family:system-ui;padding:2rem;line-height:1.6">' +
      "You're offline, and this page isn't cached yet. Reconnect and try again.</body>",
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Navigations: stale-while-revalidate. Serve the cached page instantly when
  // present (offline-safe — its cached subresources match), and refresh the
  // cache in the background so the next visit gets the deploy. First-ever visit
  // waits on the network, falling back to the start page, then a hard-coded
  // offline notice — never `undefined`.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fromNetwork = fetch(request)
          .then((response) => cachePut(request, response))
          .catch(() => undefined);
        if (cached) {
          event.waitUntil(fromNetwork);
          return cached;
        }
        return fromNetwork
          .then((response) => response || caches.match('/'))
          .then((response) => response || offlineResponse());
      }),
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
