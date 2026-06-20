const urlsToCache = ["/", "index.html"];

self.addEventListener("install", (event) => {
    event.waitUntil(async () => {
       const cache = await caches.open("calcolatrice-cache");
       return cache.addAll(urlsToCache);
    });
 });

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});