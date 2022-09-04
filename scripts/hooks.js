//API of countries info for clues
export async function getCountryClues(country){
    const resp = await fetch("https://restcountries.com/v3.1/name/"+country+"?fullText=true");
    const data = await resp.json();
    const clues = data[0]
    return clues
}

//Confetti library usage when win
export function makeItRain() {
    let end = Date.now() + (5 * 1000);

    let colors = ['#ff0000', '#ffffff'];

    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
}
