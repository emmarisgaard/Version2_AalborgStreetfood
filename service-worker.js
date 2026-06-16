const baseUrl = "/class/MMD-csd-s25/10700521/Version2_AalborgStreetfood/";


const cacheName = "aalborgStreetfood-cache-v1"

const cacheAssets = [
  // alt der skulle kunne hentes offline, hvilket er alle mapper
  // html
  baseUrl + "index.html",
  baseUrl + "aktiviteter.html",
  baseUrl + "boder.html",
  baseUrl + "events.html",
  baseUrl + "faq.html",
  baseUrl + "kontakt.html",
  baseUrl + "kort.html",
  baseUrl + "specifikAktivitet.html",
  baseUrl + "specifikBod.html",
  baseUrl + "specifikEvent.html",
  //  css
  baseUrl + "assets/css/aktiviteter.css",
  baseUrl + "assets/css/boder.css",
  baseUrl + "assets/css/events.css",
  baseUrl + "assets/css/faq.css",
  baseUrl + "assets/css/forside.css",
  baseUrl + "assets/css/kontakt.css",
  baseUrl + "assets/css/specifikAktivitet.css",
  baseUrl + "assets/css/specifikBod.css",
  baseUrl + "assets/css/specifikEvent.css",
  baseUrl + "assets/css/style.css",
  //  JavaScript
  baseUrl + "assets/js/aktiviteter.js",
  baseUrl + "assets/js/boder.js",
  baseUrl + "assets/js/events.js",
  baseUrl + "assets/js/faq.js",
  baseUrl + "assets/js/specifikAktivitet.js",
  baseUrl + "assets/js/specifikBod.js",
  baseUrl + "assets/js/specifikEvent.js",
  // img
  baseUrl + "assets/img/aktiviteterBillede.webp",
  baseUrl + "assets/img/aktiviteterBilledeLille.webp",
  baseUrl + "assets/img/bar_madame.webp",
  baseUrl + "assets/img/boderBilled.webp",
  baseUrl + "assets/img/boderBilledLille.webp",
  baseUrl + "assets/img/boernenesDag.webp",
  baseUrl + "assets/img/boernenesDagLille.webp",
  baseUrl + "assets/img/elsanto.webp",
  baseUrl + "assets/img/elsantoLille.webp",
  baseUrl + "assets/img/eventsBillede.webp",
  baseUrl + "assets/img/eventsBilledeLille.webp",
  baseUrl + "assets/img/faqBillede.webp",
  baseUrl + "assets/img/forsideBillede.webp",
  baseUrl + "assets/img/Gluten.svg",
  baseUrl + "assets/img/kontaktBillede.webp",
  baseUrl + "assets/img/Kort.webp",
  baseUrl + "assets/img/Laktose.svg",
  baseUrl + "assets/img/logo.svg",
  baseUrl + "assets/img/logov2_192x192.png",
  baseUrl + "assets/img/logov2_512x512.png",
  baseUrl + "assets/img/Noedder.svg",
  baseUrl + "assets/img/Skaldyr.svg",
  baseUrl + "assets/img/sweetvibes.webp",
  baseUrl + "assets/img/Vegetar.svg",
  baseUrl + "assets/img/Yoga-med-1.webp",
  baseUrl + "assets/img/Yoga-med-1Lille.webp"
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
          return caches.match(baseUrl + "index.html");
        }

      });
    })
  );
});
