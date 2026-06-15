// Definer basis-URL til WordPress REST API 
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";

// Finder id fra det card men har trykket på
const params = new URLSearchParams(window.location.search); //https://www.w3schools.com/jsref/prop_loc_search.asp
const aktivitetId = params.get("id");


// Funktion til at hente én specifik aktivitet baseret på id'et i URL'en
getAktivitet(); //kalder funktion getAktivitet

async function getAktivitet() {
    try {
        const response = await fetch(
            `${baseUrl}/${aktivitetId}?acf_format=standard` //tager id fra den aktivitet man har trykket på fra url, og tilføjer til vores api url, sammen med acf_format=standard for at få fat i acf felterne.
        );

        const post = await response.json(); // konverterer json til javascript objekt

        renderAktivitet(post); //kører funktionen til at vise aktivitet på siden

    } catch (error) {
        console.error("Fejl:", error); //viser fejl i konsol hvis der er problemer med at hente data fra api'et

        // Vis fejlbesked på siden
        const fejl = document.querySelector(".overlaySection");
        fejl.innerHTML = `
        <div class="fejlbesked">
            <p>Noget gik galt, prøv at genindlæse siden.</p>
        </div>
    `;
    }
}

// Funktion til at vise den specifikke aktivitet på siden
function renderAktivitet(post) {
    const aktivitetContainer = document.querySelector(".aktivitetContainer"); //Fang containeren hvor aktiviteten skal vises

    aktivitetContainer.innerHTML = ""; // Ryd containeren før tilføjelse


    // viser hero billede med alt tekst - bruger medium_large størrelse
    const heroBillede = document.querySelector(".heroBillede");
    heroBillede.innerHTML = `<img src="${post.acf.hero_billede.sizes["medium_large"]}" alt="Billede af ${post.acf.overskrift_event}" fetchpriority="high">`;


    // laver pakker HTML - vises kun hvis pakken har en overskrift
    const pakker = [post.acf.pakke_1, post.acf.pakke_2, post.acf.pakke_3] // pakkenavne fra wordpress
        .filter(pakke => pakke && pakke.pakke_overskrift) // fjerner tomme pakker
        .map(pakke => { // laver HTML for hver pakke

            const beskrivelse = pakke.pakke_intro // viser beskrivelse hvis der er en
                ? `<p>${pakke.pakke_intro}</p>`
                : "";

            const pris = pakke.pakke_pris // viser pris kun hvis der er en pris i pakken
                ? `<h3 class="pakkePris"> ${pakke.pakke_pris} kr</h3>`
                : "";


            return `<div class="pakke">
            <div class="pakkeHeader">
                <h3>${pakke.pakke_overskrift}</h3>
                ${pris}
            </div>
            ${beskrivelse}
        </div>`;
        }).join(""); // join bruges for at samle alle pakker i én string, så det kan indsættes i HTML'en

    // viser booking knap kun hvis der er et booking link
    const bookingLink = post.acf.booking_link
        ? `<a href="${post.acf.booking_link}" target="_blank" rel="noopener noreferrer" class="knap">Book ${post.acf.overskrift_aktivitet}</a>`
        : "";

    // viser pakker sektion kun hvis der er pakker, ellers vises ingenting (gratis aktivitet)
    const pakkerSektion = pakker
        ? `<article class="pakkerSektion">
                ${pakker}
                ${bookingLink}
            </article>`
        : "";

    // tilføjer html til siden og indsætter dynamisk fra wordpress
    aktivitetContainer.innerHTML = `
        <article class="introSektion">
            <h1>${post.acf.overskrift_aktivitet}</h1>
            <p>${post.acf.intro_tekst}</p>
        </article>

        <hr>

        ${pakkerSektion}

        <img class="aktivitetLokation" src="${post.acf.aktivitet_lokation.sizes["medium_large"]}" alt="Kort over lokation for ${post.acf.overskrift_aktivitet}">
    `;
}