// Definer basis-URL til WordPress REST API
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";
const kategorierUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/event_category";
const categoryId = 22; // Event kategori id

// Henter kategorier og events
getKategorier();
getAllEvents();

// Filter dropdown
// Henter alle event kategorier og viser dem i filter dropdown
async function getKategorier() {
    try {
        const response = await fetch(kategorierUrl);
        const kategorier = await response.json();
        renderKategorier(kategorier);
    } catch (error) {
        console.error("Fejl ved hentning af kategorier:", error);

        // Vis fejlbesked på siden
        const fejl = document.querySelector(".overlaySection");
        fejl.innerHTML = `
        <div class="fejlbesked">
            <p>Noget gik galt, prøv at genindlæse siden.</p>
        </div>
    `;
    }
}

// Render kategorier som checkboxes i filter dropdown
function renderKategorier(kategorier) {
    const filterListe = document.querySelector(".filterListe");
    filterListe.innerHTML = ""; // Ryd containeren før tilføjelse

    // Tilføj en checkbox for hver kategori
    kategorier.forEach(kategori => {
        filterListe.innerHTML += `
            <label class="filterKategori">
                <input type="checkbox" value="${kategori.id}" class="filterCheckbox">
                ${kategori.name}
            </label>
        `;
    });

    // lytter på checkboxes og henter events igen når filter ændres
    document.querySelectorAll(".filterCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const valgteKategorier = Array.from(document.querySelectorAll(".filterCheckbox:checked"))
                .map(cb => cb.value); // finder alle checkede checkboxes og henter deres værdier

            getAllEvents(valgteKategorier); // henter events med de valgte kategorier
        });
    });
}

// toggle filter dropdown mellem vist og skjult
function toggleFilter() {
    const dropdown = document.querySelector(".filterDropdown");
    const pil = document.querySelector(".filterKnap i");
    const erSkjult = dropdown.style.display === "none"; // tjekker om dropdown er skjult
    dropdown.style.display = erSkjult ? "block" : "none"; // viser eller skjuler dropdown
    pil.classList.toggle("roteret"); // roterer pilen
}

// Henter alle events - filtrerer efter valgte kategorier hvis der er nogen
async function getAllEvents(valgteKategorier = []) {
    try {
        // tilføjer event_category filter til url hvis der er valgte kategorier
        const filterParam = valgteKategorier.length > 0 //Tjekker om der er valgt kategorier
            ? `&event_category=${valgteKategorier.join(",")}` // Hvis der er valgt kategorier, så tilføj dem til url'en
            : ""; //ellers tilføj ingen filter

        const response = await fetch(
            `${baseUrl}?acf_format=standard&per_page=100&categories=${categoryId}&orderby=date&order=asc${filterParam}`
        );

        const posts = await response.json();
        renderEvents(posts);

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

// Render events på siden
function renderEvents(posts) {
    const eventContainer = document.querySelector(".eventsCards"); //finder containeren hvor events skal indsættes
    eventContainer.innerHTML = ""; //tømmer for indhold først

    // Loop igennem hvert event og tilføj det til containeren
    posts.forEach(post => {

        // Hvis eventet har en sticker, vis den
        const sticker = post.acf.sticker?.length
            ? `<div class="sticker"><p>${post.acf.sticker[0]}</p></div>`
            : "";

        //Indsæt indhold i containeren
        eventContainer.innerHTML += `
            <a href="./specifikEvent.html?id=${post.id}" class="eventCard">
                <img src="${post.acf.hero_billede.sizes["medium_large"]}" alt="Billede af event" loading="lazy">
                ${sticker}
                <div class="eventCardText">
                    <h2>${post.acf.overskrift_event}</h2>
                    <p>${post.acf.dato_tid}</p>
                    <p>${post.acf.intro_tekst}</p>
                    <button>Læs mere</button>
                </div>
            </a>
        `;
    });
}
