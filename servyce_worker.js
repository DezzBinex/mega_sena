const CACHE_NAME = 'mega-sena-v1';

const ARQUIVOS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (evento ) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARQUIVOS);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys().then((nomesDeCache) => {
            return Promise.all(
                nomesDeCache
                    .filter((nome) => nome !== CACHE_NAME)
                    .map((nome) => caches.delete(nome))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
    if (evento.request.method !== 'GET') {
        return;
    }

    evento.respondWith(
        caches.match(evento.request).then((respostaEmCache) => {
            if (respostaEmCache) {
                return respostaEmCache;
            }

            return fetch(evento.request)
                .then((respostaDaInternet) => {
                    const copia = respostaDaInternet.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(evento.request, copia);
                    });

                    return respostaDaInternet;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});
