const urlsToCache = ["/", "index.html"];

self.addEventListener("install", (event) => {
    event.waitUntil(async () => {
       const cache = await caches.open("fantomius-cache");
       return cache.addAll(urlsToCache);
    });
 });

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resp => {
            return resp || fetch(e.request);
        })
    );
});