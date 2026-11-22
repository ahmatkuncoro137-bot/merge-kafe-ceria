/* Service worker: cache semua file game agar bisa main offline. Naikkan VERSI tiap rilis. */
const VERSI = 'wcm-publik-0.4.1-preview-1';
const FILES = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './fonts/Fredoka.ttf', './fonts/LuckiestGuy.ttf', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './js/config.js', './js/art.js', './js/app.js',
  './js/data/merge-data.js', './js/data/ubin-levels.js',
  './js/core/storage.js', './js/core/economy.js', './js/core/save.js', './js/core/settings.js', './js/core/state.js', './js/core/server.js',
  './js/core/util.js', './js/core/fx.js', './js/core/ads.js', './js/core/iap.js',
  './js/modes/merge.js', './js/modes/ubin.js', './js/modes/lari-logic.js', './js/modes/lari.js', './js/ui/shell.js'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || /admin/.test(u.pathname)) return;   // admin tidak di-cache
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request).then((res) => {
    if (res.ok) { const cp = res.clone(); caches.open(VERSI).then((c) => c.put(e.request, cp)); }
    return res;
  })));
});
