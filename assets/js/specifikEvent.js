// Definer basis-URL til WordPress REST API
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";

// Finder id fra det card men har trykket på
const params = new URLSearchParams(window.location.search); //https://www.w3schools.com/jsref/prop_loc_search.asp
const eventId = params.get("id");

// Funktion til at hente ét specifikt event baseret på id'et i URL'en
getEvent(); //Kalder funktionen

async function getEvent() {
    try {
        const response = await fetch(
            `${baseUrl}/${eventId}?acf_format=standard` //tager id fra det event man har trykket på fra url, og tilføjer til vores api url, sammen med acf_format=standard for at få fat i acf felterne.
        );

        const post = await response.json(); // konverterer json til javascript objekt

        renderEvent(post); //kører funktionen til at vise event på siden

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

// Funktion til at vise den specifikke event på siden
function renderEvent(post) {
    const eventContainer = document.querySelector(".eventContainer");

    eventContainer.innerHTML = ""; // Ryd containeren før tilføjelse

    // viser hero billede med alt tekst - bruger medium_large størrelse
    const heroBillede = document.querySelector(".heroBillede");
    heroBillede.innerHTML = `<img src="${post.acf.hero_billede.sizes["medium_large"]}" alt="Billede af ${post.acf.overskrift_event}" fetchpriority="high">`;

    // viser billet sektion kun hvis der er en billet overskrift
    const billetSektion = post.acf.billetter.billet_overskrift
        ? `<article class="billetSektion">
               
                <div class="billetRække">
                    <h3>Billetter</h3>
                    <h3 class="billetPris">${post.acf.billetter.billet_pris ? `${post.acf.billetter.billet_pris}` : ""}</h3>
                </div>
            ${post.acf.booking_link
            ? `<div class="knapWrapper">
           <a href="${post.acf.booking_link}" target="_blank" rel="noopener noreferrer" class="knap">${post.acf.billetter.billet_overskrift}</a>
       </div>`
            : ""}
            
                </article>`
        : "";



    // viser lokationskort kun hvis aktivitet_lokation er udfyldt
    const lokation = post.acf.aktivitet_lokation
        ? `<img class="eventLokation" src="${post.acf.aktivitet_lokation.sizes["medium_large"]}" alt="Kort over lokation for ${post.acf.overskrift_event}">`
        : "";

    // viser event beskrivelse kun hvis event_beskrivelse er udfyldt
    const beskrivelse = post.acf.event_beskrivelse
        ? `<p>${post.acf.event_beskrivelse}</p>`
        : "";

    // tilføjer html til siden og indsætter dynamisk fra wordpress
    eventContainer.innerHTML = `


        <article class="introSektion">
            <h1>${post.acf.overskrift_event}</h1>
            <div class="eventMeta">
                <h2><i class="fa-regular fa-clock"></i> ${post.acf.dato_tid}</h2>
                <h2><i class="fa-solid fa-location-dot"></i> ${post.acf.lokation}</h2>
            </div>
            <p>${post.acf.intro_tekst}</p>
            <div class="knapWrapper"><a href="#beskrivelse"><button>Læs mere</button></a></div>
        </article>
<hr>
        ${billetSektion}
<hr>
        <div class="eventBeskrivelse" id="beskrivelse">
            ${beskrivelse}
        </div>

        ${lokation}
    `;
}
