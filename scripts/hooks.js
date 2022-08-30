const imageCarousel = document.querySelector("#imageCarousel")
export async function getCountryImages(country) {
    const resp = await fetch("https://www.googleapis.com/customsearch/v1?key=AIzaSyDyZaa4sUTnT3PkKDf8RPbUMHKXEd_lOXg&cx=15afa1a669e03487c&q="+country+"+places+to+visit&start=10");
    const data = await resp.json();
    data.items.forEach(element => {
        const div = document.createElement("div")
        div.classList.add("carousel-item")
        div.innerHTML =
        `<img src="${element.pagemap.cse_image[0].src}" class="d-block w-100">`
        imageCarousel.appendChild(div)
    });
    console.log(data);
}


export function makeItRain() {
    let end = Date.now() + (5 * 1000);

    let colors = ['#bb0000', '#ffffff'];

    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            zIndex: 999
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            zIndex: 999
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
}
