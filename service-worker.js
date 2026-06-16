const cacheName = "aalborgStreetfood-cache-v1"

const cacheAssets = [
  // alt der skulle kunne hentes offline, hvilket er alle mapper
  // html
  "index.html",
  "aktiviteter.html",
  "boder.html",
  "events.html",
  "faq.html",
  "kontakt.html",
  "kort.html",
  "specifikAktivitet.html",
  "specifikBod.html",
  "specifikEvent.html",
  //  css
  "aktiviteter.css",
  "boder.css",
  "events.css",
  "faq.css",
  "forside.css",
  "kontakt.css",
  "specifikAktivitet.css",
  "specifikBod.css",
  "specifikEvent.css",
  "style.css",
  //  JavaScript
  "aktiviteter.js",
  "boder.js",
  "events.js",
  "faq.js",
  "specifikAktivitet.js",
  "specifikBod.js",
  "specifikEvent.js",
  // img
  "assets/img/aktiviteterBillede.webp",
  "assets/img/aktiviteterBilledeLille.webp",
  "assets/img/bar_madame.webp",
  "assets/img/boderBillede.webp",
  "assets/img/boderBilledeLille.webp",
  "assets/img/boernenesDag.webp",
  "assets/img/boernenesDagLille.webp",
  "assets/img/elsanto.webp",
  "assets/img/elsantoLille.webp",
  "assets/img/eventsBillede.webp",
  "assets/img/eventsBilledeLille.webp",
  "assets/img/faqBillede.webp",
  "assets/img/forsideBillede.webp",
  "assets/img/Gluten.svg",
  "assets/img/kontaktBillede.webp",
  "assets/img/Kort.webp",
  "assets/img/Laktose.svg",
  "assets/img/logo.svg",
  "assets/img/logov2_192x192.png",
  "assets/img/logov2_512x512.png",
  "assets/img/Noedder.svg",
  "assets/img/Skaldyr.svg",
  "assets/img/sweetvibes.webp",
  "assets/img/Vegetar.svg",
  "assets/img/Yoga-med-1.webp",
  "assets/img/Yoga-med-1Lille.webp"
];

// INSTALLERE EVENT
// Kører første gang service workeren installeres.
// Her gemmes alle app-filer i browserens cache.
self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheAssets);
    })
  );

  // Aktiverer den nye service worker med det samme i stedet for at vente på næste side-load.
  self.skipWaiting();
});


// ACTIVATE EVENT
// Kører når den nye service worker overtager kontrollen.
// Her sletter vi gamle caches fra tidligere versioner.
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          // behold kun den aktuelle cache
          .filter((key) => key !== cacheName)
          // slet alle gamle caches
          .map((key) => caches.delete(key))
      );
    })
  );

  // Gør at service workeren straks styrer alle åbne faner
  self.clients.claim();
});


// FETCH EVENT
// Kører hver gang appen forsøger at hente en fil.
self.addEventListener("fetch", (event) => {

  // vi håndterer kun GET-requests
  if (event.request.method !== "GET") return;

  const request = event.request;

  // navigation requests er typisk når brugeren åbner en side
  const isNavigationRequest = request.mode === "navigate";

  event.respondWith(

    // Først forsøger vi at finde filen i cachen
    caches.match(request).then((cachedResponse) => {

      // hvis filen findes i cachen returneres den
      if (cachedResponse) {
        return cachedResponse;
      }

      // ellers forsøger vi at hente den fra nettet
      return fetch(request).catch(() => {

        // hvis nettet fejler og det er en navigation
        // returneres index.html som offline fallback
        if (isNavigationRequest) {
          return caches.match("index.html");
        }

      });
    })
  );
});
