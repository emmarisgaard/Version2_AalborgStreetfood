// Definer basis-URL til WordPress REST API
const baseUrl = "https://test.lerkehallund.dk/wp-json/wp/v2/posts";

// Finder id fra det card men har trykket på
const params = new URLSearchParams(window.location.search); //https://www.w3schools.com/jsref/prop_loc_search.asp
const bodId = params.get("id");


// Funktion til at hente én specifik opskrift
getBod(); //kalder funktionen


async function getBod() {
    try {
        const response = await fetch(
            `${baseUrl}/${bodId}?acf_format=standard` //tager id fra det card man har trykket på fra url, og tilføjer til vores api url, sammen med acf_format=standard for at få fat i acf felterne.
        );

        const post = await response.json(); // konverterer json til javascript objekt

        renderBod(post); //kører funktionen til at vise bod på siden

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



// Funktion til at vise den specifikke bod på siden
function renderBod(post) {
    const bodContainer = document.querySelector(".bodContainer");

    bodContainer.innerHTML = ""; // Ryd containeren før tilføjelse

    // laver objekt med allergener og deres ikoner
    const allergenIkoner = {
        "Vegetarisk": "./assets/img/Vegetar.svg",
        "Indeholder laktose": "./assets/img/Laktose.svg",
        "Indeholder gluten": "./assets/img/Gluten.svg",
        "Indeholder nødder": "./assets/img/Noedder.svg",
        "Indeholder skaldyr": "./assets/img/Skaldyr.svg"
    };

    // viser hero billede med alt tekst
    const heroBillede = document.querySelector(".heroBillede");
    heroBillede.innerHTML = `<img src="${post.acf.herocard_billede.sizes["medium_large"]}" alt="Billede af mad fra ${post.acf.titel}" fetchpriority="high">`;


    // Find alle samlinger dynamisk (menu_samling_1, menu_samling_2 osv.)
    // og filtrer dem så kun samlinger med en overskrift vises og dermed ikke tomme samlinger
    const samlinger = Object.keys(post.acf.menukort)
        .filter(key => key.startsWith("menu_samling_")) // filter finder alle keys i samling objektet der starter med "menu_samling_" og returnerer dem som et array
        .map(key => post.acf.menukort[key]) // map laver html for hver samling
        .filter(samling => samling.samling_overskrift !== ""); // fjerner samlinger uden overskrift


    // Lav HTML for alle samlinger
    const samlingsHTML = samlinger.map(samling => {

        // Find alle retter i en samling
        const retter = Object.keys(samling)
            .filter(key => key.startsWith("ret_")) // filter finder alle keys i samling objektet der starter med "ret_" og returnerer dem som et array
            .map(key => samling[key]) // map laver html for hver ret
            .filter(ret => ret.ret_overskrift !== ""); // fjerner retter uden overskrift

        const retterHTML = retter.map(ret => { // laver HTML for allergenerne for hver ret
            const allergenerHTML = Array.isArray(ret.ret_allergener) // tjekker om ret.ret_allergener er et array
                ? ret.ret_allergener // hvis det er et array, laver det HTML for hver allergen
                    .map(allergen => `<img src="${allergenIkoner[allergen]}" alt="${allergen}" class="allergen">`)
                    .join("") // join kombinerer alle allergen ikoner til en string
                : "";

            return `<div class="menuItem">
            <div class="menuItemHeader">
                <div class="menuItemHeader">
                    <h3>${ret.ret_overskrift}</h3>
                    <div class="allergeneIkon">
                       ${allergenerHTML}
                    </div>
                </div>
                <h3>${ret.ret_pris}</h3>
            </div>
            <p>${ret.ret_beskrivelse}</p>
        </div>`;
        }).join(""); // join kombinerer alle retter til en string, så vi kan indsætte det i html

        // Vis kun beskrivelse og pris hvis de er udfyldt
        const beskrivelseHTML = samling.samling_beskrivelse
            ? `<p class="samlingBeskrivelse">${samling.samling_beskrivelse}</p>`
            : "";

        const prisHTML = samling.samling_pris
            ? `<p class="samlingPris">${samling.samling_pris} kr</p>`
            : "";

        // Returner HTML for denne samling, inklusiv retterne
        return `<div class="menuSamling">
                    <h2 class="samlingOverskrift">${samling.samling_overskrift}</h2>
                    <p class="samlingBeskrivelse">${beskrivelseHTML}</p>
                    <p class="samlingPris">${prisHTML}</p>
                </div>
                ${retterHTML}`;
    }).join(""); // join kombinerer alle samlinger med deres tilhørende retter til en string, så vi kan indsætte det i html

    // tilføjer html til siden og indsætter dynamisk fra wordpress
    bodContainer.innerHTML += `
        <article class="introSection">
                    <div class="intro">
                        <h1 class="titel">${post.acf.titel}</h1>
                        <p class="introTekst">${post.acf.intro_tekst}</p>
                    </div>
                    <div class="allergener">
                        <div class="allergen">
                            <img src="./assets/img/Vegetar.svg" alt="Vegetar ikon">
                            <p>Vegetarisk</p>
                        </div>
                        <div class="allergen">
                            <img src="./assets/img/Laktose.svg" alt="Indeholder laktose ikon">
                            <p>Indeholder laktose</p>
                        </div>
                        <div class="allergen">
                            <img src="./assets/img/Gluten.svg" alt="Indeholder gluten ikon">
                            <p>Indeholder gluten</p>
                        </div>
                        <div class="allergen">
                            <img src="./assets/img/Noedder.svg" alt="Indeholder nødder ikon">
                            <p>Indeholder nødder</p>
                        </div>
                        <div class="allergen">
                            <img src="./assets/img/Skaldyr.svg" alt="Indeholder skaldyr ikon">
                            <p>Indeholder skaldyr</p>
                        </div>
                    </div>
                </article>

        <article class="bodMenu">
            <div class="menuHeader">
                <h2>Menu</h2>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <hr>

                  <div class="menuItems" style="display: none;">

                ${samlingsHTML}
                <hr>
            </div>
        </article>
        <img class="bodBillede" src="${post.acf.billede_slider.billede_1.sizes["medium_large"]}" alt="Billede fra ${post.acf.titel}">
    <div class="seOgså">
    <h2>Se også...</h2>

                <article class="bodCards">
                    <a href="./specifikBod.html?id=3860" class="bodCard">
    <img src="./assets/img/bar_madame.webp" alt="Bar Madame">
    <div class="cardIndhold">
        <div class="bodCardText">
            <h2>Bar Madame</h2>
            <p>Et bredt udvalg af kolde drikke fra specialøl og cocktails til forfriskende alkoholfri favoritter.</p>
        </div>
        <button>Læs mere</button>
    </div>
</a>
<a href="./specifikBod.html?id=3667" class="bodCard">
    <img src="./assets/img/sweetvibes.webp" alt="Sweet Vibes">
    <div class="cardIndhold">
        <div class="bodCardText">
            <h2>Sweet Vibes</h2>
            <p>Lækker sulten? Kage, vafler og ægte italiensk gelato is finder du her.</p>
        </div>
        <button>Læs mere</button>
    </div>
</a>
                </article>

    </div>
    <h2>Find os her:</h2>
    <img class="bodPlaceringsBillede" src="${post.acf.bod_placering.sizes["medium_large"]}" alt="Billede fra ${post.acf.titel}">    
    `;




    //Vis menukort når man trykker på menu header, og roterer pilen
    const menuHeader = bodContainer.querySelector(".menuHeader"); // finder menu header i den html vi lige har lavet
    const menuItems = bodContainer.querySelector(".menuItems"); // finder menu items i den html vi lige har lavet
    const pil = menuHeader.querySelector("i"); // finder pil ikonet i menu headeren

    menuHeader.addEventListener("click", () => {
        const erSkjult = menuItems.style.display === "none"; // tjekker om menu items er skjult

        menuItems.style.display = erSkjult ? "flex" : "none"; // hvis erSkjult er true, så sæt display til flex for at vise menu items, ellers sæt display til none for at skjule menu items
        pil.classList.toggle("roteret"); // toggler klassen "roteret" på pilen for at rotere den
    });
}
