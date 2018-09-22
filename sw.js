let CACHE_NAME = "V52";


//install Service serviceWorker
self.addEventListener('install', (e) => {
    console.log("service worker installed");
});

self.addEventListener('activate', e => {
    console.log('worker activated');
    //Remove old caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});
//fetch addEventListener
self.addEventListener('fetch', e=> {
    e.respondWith(
        fetch(e.request)
        .then(res =>{
            const resClone = res.clone();
            caches
            .open(CACHE_NAME)
            .then(cache =>{
                cache.put(e.request, resClone);
            });
            return res;

        }).catch(err => caches.match(e.request).then(res => res))
    );
});
