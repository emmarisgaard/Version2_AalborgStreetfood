
// Funktion til at åbne og lukke accordion
const knapper = document.querySelectorAll(".accordionKnap");

knapper.forEach(knap => {
    knap.addEventListener("click", () => {
        const item = knap.closest(".accordionItem");
        const indhold = item.querySelector(".accordionIndhold");

        // Toggle accordion indhold til visning eller skjult
        knap.classList.toggle("aktiv");
        indhold.classList.toggle("aktiv");
        item.classList.toggle("aktiv");
    });
});