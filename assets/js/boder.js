// Definer basis-URL til WordPress REST API
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";

// Madboders id er 3
const categoryId = 3;

getAllBoder(); // Kalder funktionen getAllBoder


// Henter alle boder 
async function getAllBoder() {

    try {
        const response = await fetch(`${baseUrl}?acf_format=standard&per_page=100&categories=${categoryId}&orderby=title&order=asc`);
        // kilde til at sortere alfabetisk: https://developer.wordpress.org/rest-api/reference/posts/


        const posts = await response.json(); // konverterer JSON til JavaScript objekter

        renderBoder(posts);
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

// Render boderne på siden
function renderBoder(posts) {
    const boderContainer = document.querySelector(".bodCards"); //fang containeren
    boderContainer.innerHTML = ""; // Ryd containeren før tilføjelse

    posts.forEach(post => {
        // laver sticker som en variabel, indsæt kun hvis der er indhold i acf.sticker
        const sticker = post.acf.land
            ? `<div class="sticker"><p>${post.acf.land}</p></div>` : ""

        // Indsæt html i containeren. Gør sådan at hvert card linker til den specifikke bod med id fra post.id
        boderContainer.innerHTML += `
                        <a href="./specifikBod.html?id=${post.id}" class="bodCard">

                    <img src="${post.acf.herocard_billede.sizes["medium_large"]}" alt="Billede af mad fra ${post.acf.titel}" loading="lazy">
                    ${sticker}
                    <div class="cardIndhold">
                    <div class="bodCardText">
                        <h2>${post.acf.titel}</h2>
                        <p>${post.acf.intro_tekst}
                        </p>
                        </div>
                    <button>Læs mere</button>
                    </div>
                </a>
        `});
}
