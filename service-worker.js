/* ============================================================================
   service-worker.js — Makes Ours work fully offline after first load.

   Strategy:
   • Precache the app shell on install (cache-first for these assets).
   • Runtime: cache-first for same-origin GET requests, falling back to the
     network, then to the cached index for navigations (SPA offline support).
   • Bump CACHE version to ship updates; old caches are pruned on activate.
   ========================================================================== */
const CACHE = 'ours-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/views.js',
  './js/store.js',
  './js/ui.js',
  './js/seed.js',
  './icons/icon.svg',
  './icons/maskable.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(res => {
          // Cache successful same-origin responses for next time.
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(request, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline navigation fallback → app shell.
          if (request.mode === 'navigate') return caches.match('./index.html');
        });
    })
  );
});
