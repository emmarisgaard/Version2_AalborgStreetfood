// Definer basis-URL til WordPress REST API
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";

// Kategori id'er
const fasteAktiviteterId = 24;
const børneAktiviteterId = 25;

//Kalder funktioner for at hente og vise aktiviteter
getFasteAktiviteter();
getBørneAktiviteter();

// Henter faste aktiviteter
async function getFasteAktiviteter() {
    try {
        const responseFaste = await fetch(`${baseUrl}?acf_format=standard&per_page=100&categories=${fasteAktiviteterId}&orderby=title&order=asc`);
        const fasteAktiviteter = await responseFaste.json();
        renderFasteAktiviteter(fasteAktiviteter);
    } catch (error) {
        cconsole.error("Fejl:", error); //viser fejl i konsol hvis der er problemer med at hente data fra api'et

        // Vis fejlbesked på siden
        const fejl = document.querySelector(".overlaySection");
        fejl.innerHTML = `
        <div class="fejlbesked">
            <p>Noget gik galt, prøv at genindlæse siden.</p>
        </div>
    `;
    }
}

// Render faste aktiviteter på siden i den valgte container/slider
function renderFasteAktiviteter(posts) {
    const aktiviteterContainer = document.querySelector(".fasteAktiviteterCards"); // Vælger containeren for faste aktiviteter
    aktiviteterContainer.innerHTML = ""; // Ryd containeren før tilføjelse

    posts.forEach(post => {
        // laver sticker som en variabel - vises kun hvis der er indhold i acf.sticker
        const sticker = post.acf.sticker?.[0]
            ? `<div class="sticker"><p>${post.acf.sticker[0]}</p></div>` : "";

        // tilføjer card for hver aktivitet med link til specifik aktivitetsside
        aktiviteterContainer.innerHTML += `
            <a href="./specifikAktivitet.html?id=${post.id}" class="aktivitetCard">
                <img src="${post.acf.hero_billede.sizes["medium_large"]}" alt="Billede af ${post.acf.overskrift_aktivitet}" loading="lazy">
                ${sticker}
                <div class="aktivitetCardText">
                    <h3>${post.acf.overskrift_aktivitet}</h3>
                    <button>Læs mere</button>
                </div>
            </a>
        `;
    });

    aktiviteterContainer.innerHTML += `<div class="scroll fast"><i class="fa-solid fa-chevron-right"></i></div>`; // tilføjer scroll knap efter alle cards er renderet
}


// Henter børne aktiviteter
async function getBørneAktiviteter() {
    try {
        const responseBørne = await fetch(`${baseUrl}?acf_format=standard&per_page=100&categories=${børneAktiviteterId}&orderby=title&order=asc`);
        const børneAktiviteter = await responseBørne.json();
        renderBørneAktiviteter(børneAktiviteter);
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

// Render børne aktiviteter på siden i den valgte container/slider
function renderBørneAktiviteter(posts) {
    const aktiviteterContainer = document.querySelector(".børneAktiviteterCards"); // Vælger containeren for børne aktiviteter
    aktiviteterContainer.innerHTML = ""; // Ryd containeren før tilføjelse

    posts.forEach(post => {
        // laver sticker som en variabel - vises kun hvis der er indhold i acf.sticker
        const sticker = post.acf.sticker?.[0]
            ? `<div class="sticker"><p>${post.acf.sticker[0]}</p></div>` : "";

        aktiviteterContainer.innerHTML += `
            <a href="./specifikAktivitet.html?id=${post.id}" class="aktivitetCard">
                <img src="${post.acf.hero_billede.sizes["medium_large"]}" alt="Billede af ${post.acf.overskrift_aktivitet}" loading="lazy">
                ${sticker}
                <div class="aktivitetCardText">
                    <h3>${post.acf.overskrift_aktivitet}</h3>
                    <button>Læs mere</button>
                </div>
            </a>
        `;
    });

    aktiviteterContainer.innerHTML += `<div class="scroll børn"><i class="fa-solid fa-chevron-right"></i></div>`; // tilføjer scroll knap efter alle cards er renderet
}
