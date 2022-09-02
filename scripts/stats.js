const statsModalBody = document.querySelector("#stats-modal-body");

export let userStats = {
    guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    },
    currentStreak : 0,
    maxStreak : 0,
    winCount : 0,
    playedCount : 0,
}

//-----Stats-----
//Update stats
export function updateStats(updatedStats){
    let storedStats = JSON.parse(localStorage.getItem("stats"));
    if (storedStats != null){
        updatedStats.currentStreak !== 0 ? (storedStats.currentStreak += updatedStats.currentStreak) : (storedStats.currentStreak === 0);
        storedStats.winCount += updatedStats.winCount;
        storedStats.playedCount += updatedStats.playedCount;
        for (let guessTry in storedStats.guessDistribution){
            storedStats.guessDistribution[guessTry] += updatedStats.guessDistribution[guessTry];
        }
        storedStats.currentStreak >= storedStats.maxStreak && (storedStats.maxStreak = storedStats.currentStreak);
        localStorage.setItem("stats", JSON.stringify(storedStats));
    }else {
        localStorage.setItem("stats", JSON.stringify(userStats));
    }
}
updateStats(userStats);

//Get stats to show on modal
export function showStatsModal(){
    statsModalBody.innerHTML = ``
    let storedStats = JSON.parse(localStorage.getItem("stats"));
    let guessStats = document.createElement("div");
    let guessDistributionStats = document.createElement("div");
    let winPercentage = Math.round((storedStats.winCount/storedStats.playedCount)*100) || 0;
    guessStats.innerHTML = `<div class="text-center fs-3"><p class="fw-bolder">${storedStats.currentStreak}</p><p>Racha</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.maxStreak}</p><p>Mejor racha</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.winCount}</p><p></p>Ganadas</div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.playedCount}</p><p>Jugadas</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${winPercentage}</p><p>% Ganadas</p></div>`;
    guessStats.classList.add("d-flex", "justify-content-between");
    guessDistributionStats.innerHTML = `<h2 class="text-center">DISTRIBUCION DE ACIERTOS</h2>
                                        <p><span>N°1: </span><span>${storedStats.guessDistribution[1]}</span></p>
                                        <p><span>N°2: </span><span>${storedStats.guessDistribution[2]}</span></p>
                                        <p><span>N°3: </span><span>${storedStats.guessDistribution[3]}</span></p>
                                        <p><span>N°4: </span><span>${storedStats.guessDistribution[4]}</span></p>
                                        <p><span>N°5: </span><span>${storedStats.guessDistribution[5]}</span></p>
                                        <p><span>N°6: </span><span>${storedStats.guessDistribution[6]}</span></p>`;
    guessDistributionStats.classList.add("fs-3", "border-top", "py-3");
    statsModalBody.classList.add("p-5");
    statsModalBody.appendChild(guessStats);
    statsModalBody.appendChild(guessDistributionStats);
}