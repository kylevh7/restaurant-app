let CACHE_NAME = "V3";
const cacheAssets = [
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/css/styles-rest.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
];

//install Service serviceWorker
self.addEventListener('install', (e) =>{
    console.log("service worker installed");
    e.waitUntil(
        caches
        .open(CACHE_NAME)
        .then(cache => {
            console.log('caching files');
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    console.log('worker activated');
    //Remove old caches
    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache =>{
                    if(cache !== CACHE_NAME){
                        console.log('Service Worker: clearing old cache');
                        return caches.delete(cache);                    }
                })
            )
        })
    );
});
//fetch addEventListener
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
     return cache.match(event.request).then(response => {
      return response || fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        cache.put(event.request, responseClone);
        })
      })
  })   
 );
});
