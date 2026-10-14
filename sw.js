// Ghisa moved to https://ghisaapp.github.io/ — this address only shows the "moved" page.
// A new CACHE_VERSION makes installed old apps drop the old cached app and load that page.
const CACHE_VERSION = 'ghisa-moved-1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(['./', './index.html', './icon.svg']))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
    event.respondWith(
        fetch(request, { cache: 'no-cache' }).catch(() => caches.match(request, { ignoreSearch: true }))
    );
});
