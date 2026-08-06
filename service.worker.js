// ==========================================
// SERVICE WORKER
// APP GRANJA EMILUC
// Versión 1.0
// ==========================================

const CACHE_NAME = "granja-emiluc-v1.0.0";

// Archivos principales que se almacenarán
const ARCHIVOS_CACHE = [

    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./products.json",
    "./manifest.json",

    // Bootstrap
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js",

    // Logo
    "./assets/logo.jpeg",

    // Productos
    "./assets/productos/Carne.png",
    "./assets/productos/Costilla.png",
    "./assets/productos/Chuleta.png",
    "./assets/productos/Chorizos.png",
    "./assets/productos/Molida.png",
    "./assets/productos/Combo.png"

];

//============================================
// INSTALACIÓN
//============================================

self.addEventListener("install", event => {

    console.log("Service Worker instalado");

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(ARCHIVOS_CACHE);

        })

    );

    self.skipWaiting();

});

//============================================
// ACTIVACIÓN
//============================================

self.addEventListener("activate", event => {

    console.log("Service Worker activado");

    event.waitUntil(

        caches.keys()

        .then(cacheNames => {

            return Promise.all(

                cacheNames.map(cache => {

                    if (cache !== CACHE_NAME) {

                        console.log("Eliminando caché:", cache);

                        return caches.delete(cache);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

//============================================
// INTERCEPTAR PETICIONES
//============================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

        .then(respuesta => {

            if (respuesta) {

                return respuesta;

            }

            return fetch(event.request)

            .then(networkResponse => {

                const copia = networkResponse.clone();

                caches.open(CACHE_NAME)

                .then(cache => {

                    cache.put(event.request, copia);

                });

                return networkResponse;

            })

            .catch(() => {

                // Si no hay internet y el recurso no está en caché

                if (event.request.destination === "image") {

                    return caches.match("./assets/logo.jpeg");

                }

            });

        })

    );

});

//============================================
// MENSAJES DESDE LA APP
//============================================

self.addEventListener("message", event => {

    if (event.data === "ACTUALIZAR") {

        self.skipWaiting();

    }

});