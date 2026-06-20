const CACHE_NAME = "calcolatrice-cache-v3";
const urlsToCache = [
    "./",
    "index.html",
    "src/index.css",
    "src/index.js",
    "src/state.js",
    "src/math.js",
    "src/ui.js",
    "src/handlers.js",
    "manifest.json",
    "img/logo-192.png",
    "img/logo-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "error") {
                    return networkResponse;
                }
                
                // Cache dynamically loaded assets like fonts or icons
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            }).catch(() => {
                // Offline fallback
            });
        })
    );
});