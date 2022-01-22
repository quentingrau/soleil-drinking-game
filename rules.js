const prevBtn = document.getElementById("rules-prev-btn");
const nextBtn = document.getElementById("rules-next-btn");
let active = 1;

prevBtn.addEventListener("click", () => {
    active--;
    if(active === 0) {
        active = 9;
    }
    document.querySelector(".visible").classList.remove("visible");
    const className = `.rule-${active}`;
    document.querySelector(className).classList.add("visible");
})

nextBtn.addEventListener("click", () => {
    active++;
    if(active === 10) {
        active = 1;
    }
    document.querySelector(".visible").classList.remove("visible");
    const className = `.rule-${active}`;
    document.querySelector(className).classList.add("visible");
})