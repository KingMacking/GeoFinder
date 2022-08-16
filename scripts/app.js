import {countryData} from './countries.js';

//-----Variables-----
const guess = document.querySelectorAll(".guess");
const guessButton = document.querySelector("#btnGuess");
const countrySelect = document.querySelector("#countrySelect");
const guesses = document.querySelector("#guesses");
const flag = document.querySelector("#flag-image");
const statsButtonOpen = document.querySelector("#stats-button");
const statsModalBody = document.querySelector("#stats-modal-body")
const statsButtonClose = document.querySelector("#close-stats-modal")

let guessNumber = 0
let countryA = countryData[Math.round(Math.random()*countryData.length)];
console.log(countryA);

//-----Events-----
guessButton.addEventListener("click", compareCountries);
statsButtonOpen.addEventListener("click", showStatsModal);

//-----Functions-----

//Add all countries to selection options
function addCountriesOptions(){
    for(const country of countryData){
        let option = document.createElement("option");
        option.value = `${country.name.toUpperCase()}`;
        option.innerHTML = `${country.name.toUpperCase()}`;
        countrySelect.appendChild(option);
    }
}
addCountriesOptions();

//Obtain selected country
function getSelectedCountry(){
    let guessOption = document.querySelector("#countrySelect").value;
    console.log(guessOption);
    return guessOption;
}

//Compare countries to obtain data
function compareCountries(){
    let guessCountry = getSelectedCountry();
    console.log(guessCountry);
    if (guessCountry.toUpperCase() != (countryA.name).toUpperCase()) {
        let countryB = countryData.find((pais)=>{
            return pais.name.toUpperCase() == guessCountry.toUpperCase();
        })
        if (countryB) {
            let distance = Math.round(getDistance(countryA.latitude, countryA.longitude, countryB.latitude, countryB.longitude));
            let direction = getDirection(countryA.latitude, countryA.longitude, countryB.latitude, countryB.longitude);
            guess[guessNumber].innerText = "El pais a adivinar se encuentra a "+distance+"KM hacia "+direction;
            guessNumber++;
        } else {
            guess[guessNumber].innerText="Debes elegir un pais";
        }
    } else {
        sendAlert("win");
        const tryCount = guessNumber + 1;
        userStats.guessDistribution[tryCount]++;
        userStats.currentStreak++;
        userStats.playedCount++;
        userStats.winCount++;
        // saveLocal("stats", JSON.stringify(userStats));
        updateStats(userStats);
        // localStorage.removeItem("stats");
    }
    if (guessNumber==6){
        sendAlert("lose");
        userStats.currentStreak = 0;
        userStats.playedCount++;
        // saveLocal("stats", JSON.stringify(userStats));
        updateStats(userStats);
    }
}

//Get direction between countries
function getDirection (lat1, lon1, lat2, lon2){
    let North = "⬆️";
    let East = "➡️";
    let West = "⬅️";
    let South = "⬇️";
    let SouthEast = "↘️";
    let SouthWest = "↙️";
    let NorthEast = "↗️";
    let NorthWest = "↖️";

    const dLat = lat1 - lat2;
    const dLon = lon1 - lon2;
    console.log(lat1 + " | " + lat2);
    console.log(lon1 + " | " + lon2);
    console.log(dLat + " | " + dLon);

    if ((lat1>lat2) && (lon1>lon2)){
        return NorthEast;
    } else if ((lat1<lat2) && (lon1>lon2)){
        return SouthEast;
    } else if ((lat1>lat2) && (lon1<lon2)){
        return NorthWest;
    } else if ((lat1<lat2) && (lon1<lon2)){
        return SouthWest;
    } else if ((lat1>lat2)){
        return North;
    } else if ((lat1<lat2)){
        return South;
    } else if ((lon1<lon2)){
        return West;
    } else if ((lon1>lon2)) {
        return East;
    }
}

//Obtain distance between centers of countries
function getDistance (lat1, lon1, lat2, lon2) {
    const toRad = function (x) {return x*Math.PI/180};
    let R = 6378.137; //Earth radius
    let dLat = toRad(lat2-lat1);
    let dLong = toRad(lon2-lon1);
    let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLong/2)*Math.sin(dLong/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    //Obtain distance in KM
    let d = R * c;
    return d;
}

//Win & Lose alerts
function sendAlert(alertType){
    if (alertType == "win"){
        guess[guessNumber].innerText = "¡Muy bien! El pais a adivinar era " + countryA.name;
        guess[guessNumber].classList.add("win", "fw-bold");
    } else if (alertType == "lose"){
        let loseAlert = document.createElement("div");
        loseAlert.innerText = `¡Has perdido! El pais a adivinar era ${countryA.name.toUpperCase()}`;
        loseAlert.classList.add("guess", "p-3", "text-center", "lose", "mt-4", "fw-bold", "h-auto");
        guesses.appendChild(loseAlert);
    }
    flag.src = `https://flagcdn.com/${countryA.code}.svg`;
    guessButton.disabled = true;
}

const saveLocal = (key, value) => {localStorage.setItem(key, value)};
let userStats = {
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
function updateStats(updatedStats){
    let storedStats = JSON.parse(localStorage.getItem("stats"));
    console.log(storedStats);
    if (storedStats != null){
        if(updatedStats.currentStreak != 0){
            storedStats.currentStreak += updatedStats.currentStreak;
        } else {
            storedStats.currentStreak = 0;
        }
        storedStats.winCount += updatedStats.winCount;
        storedStats.playedCount += updatedStats.playedCount;
        for (let guessTry in storedStats.guessDistribution){
            storedStats.guessDistribution[guessTry] += updatedStats.guessDistribution[guessTry];
        }
        if (storedStats.currentStreak >= storedStats.maxStreak){
            storedStats.maxStreak = storedStats.currentStreak;
        }
        localStorage.setItem("stats", JSON.stringify(storedStats));
    }else {
        localStorage.setItem("stats", JSON.stringify(userStats));
    }
}

//Get stats to show on modal
function showStatsModal(){
    statsModalBody.innerHTML = ``
    let storedStats = JSON.parse(localStorage.getItem("stats"));
    let guessStats = document.createElement("div");
    let guessDistributionStats = document.createElement("div");
    let winPercentage = Math.round((storedStats.winCount/storedStats.playedCount)*100)
    guessStats.innerHTML = `<div class="text-center fs-3"><p class="fw-bolder">${storedStats.currentStreak}</p><p>Racha</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.maxStreak}</p><p>Mejor racha</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.winCount}</p><p></p>Ganadas</div>
                            <div class="text-center fs-3"><p class="fw-bolder">${storedStats.playedCount}</p><p>Jugadas</p></div>
                            <div class="text-center fs-3"><p class="fw-bolder">${winPercentage}</p><p>% Ganadas</p></div>`;
    guessStats.classList.add("d-flex", "justify-content-between");
    guessDistributionStats.innerHTML = `<h2 class="text-center">DISTRIBUCION DE ACIERTOS</h2>
                                        <p><span>1: </span><span>${storedStats.guessDistribution[1]}</span></p>
                                        <p><span>2: </span><span>${storedStats.guessDistribution[2]}</span></p>
                                        <p><span>3: </span><span>${storedStats.guessDistribution[3]}</span></p>
                                        <p><span>4: </span><span>${storedStats.guessDistribution[4]}</span></p>
                                        <p><span>5: </span><span>${storedStats.guessDistribution[5]}</span></p>
                                        <p><span>6: </span><span>${storedStats.guessDistribution[6]}</span></p>`;
    guessDistributionStats.classList.add("fs-3", "border-top", "py-3");
    statsModalBody.classList.add("p-5");
    statsModalBody.appendChild(guessStats);
    statsModalBody.appendChild(guessDistributionStats);
}