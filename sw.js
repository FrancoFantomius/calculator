const CACHE_NAME = "calcolatrice-cache-v5";
const urlsToCache = [
    "./",
    "index.html",
    "src/index.css",
    "src/index.js",
    "src/i18.js",
    "src/state.js",
    "src/math.js",
    "src/ui.js",
    "src/handlers.js",
    "manifest.json",
    "img/logo-192.png",
    "img/logo-512.png",
    "langs/it.json",
    "langs/en.json",
    "langs/es.json",
    "langs/fr.json",
    "langs/de.json",
    "langs/ru.json",
    "langs/zh.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
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
                // Check if response is successful or a cross-origin Google Font (which can be opaque with status 0)
                const isSuccessful = networkResponse && networkResponse.status === 200;
                const isOpaque = networkResponse && networkResponse.status === 0;
                const isGoogleFont = event.request.url.includes("fonts.googleapis.com") || 
                                     event.request.url.includes("fonts.gstatic.com");
                
                if (isSuccessful || (isOpaque && isGoogleFont)) {
                    // Cache dynamically loaded assets like fonts or icons
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                
                return networkResponse;
            }).catch(() => {
                // Offline fallback
            });
        })
    );
});