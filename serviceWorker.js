self.addEventListener('install', event => {
    console.log("Service Worker installiert");
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log("Service Worker aktiviert");
});

setInterval(() => {
    console.log("Service Worker läuft im Hintergrund...");
}, 5000);
