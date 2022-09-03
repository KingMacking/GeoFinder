// import {countryData} from './countries.js';
import {userStats, updateStats, showStatsModal} from './stats.js';
import { makeItRain } from './hooks.js';
import { getCountryClues } from './hooks.js';


//-----Variables-----
const guess = document.querySelectorAll(".guess");
const guessButton = document.querySelector("#btnGuess");
const replayButton = document.querySelector("#btnReplay");
const countrySelect = document.querySelector("#countrySelect");
const flag = document.querySelector("#flag-image");
const statsButtonOpen = document.querySelector("#stats-button");
const loadingOverlay = document.querySelector("#loading");
//Clues
const areaClue = document.querySelector("#areaClue");
const popClue = document.querySelector("#popClue");
const hemClue = document.querySelector("#hemClue");
const continentClue = document.querySelector("#continentClue");
const arrowDirections = {
    N: "⬆️",
    NNE: "↗️",
    NE: "↗️",
    ENE: "↗️",
    E: "➡️",
    ESE: "↘️",
    SE: "↘️",
    SSE: "↘️",
    S: "⬇️",
    SSW: "↙️",
    SW: "↙️",
    WSW: "↙️",
    W: "⬅️",
    WNW: "↖️",
    NW: "↖️",
    NNW: "↖️",
}


let guessNumber = 0



//-----Events-----
guessButton.addEventListener("click", compareCountries);
replayButton.addEventListener("click", refreshPage);
statsButtonOpen.addEventListener("click", showStatsModal);

//-----Functions-----
const getCountries = async () => {
    const resp = await fetch('./scripts/countries.json');
    const data = await resp.json();
    let countries = data.countryData;
    for(const country of countries){
        let option = document.createElement("option");
        option.value = `${country.name.toUpperCase()}`;
        option.innerHTML = `${country.name.toUpperCase()}`;
        countrySelect.appendChild(option);
    }
    let randomCountry = countries[Math.round(Math.random()*countries.length)];
    localStorage.setItem("countryA", JSON.stringify(randomCountry));
    setTimeout(() =>{
        loadingOverlay.style.display = "none";
    }, 2000);
    return countries
}
let countryData = await getCountries();
let countryA = JSON.parse(localStorage.getItem("countryA"));

//Obtain selected country
function getSelectedCountry(){
    let guessOption = document.querySelector("#countrySelect").value;
    return guessOption;
}

//Compare countries to obtain data
function compareCountries(){
    let guessCountry = getSelectedCountry();
    console.log(countryData);
    if (guessCountry.toUpperCase() !== (countryA.name).toUpperCase()) {
        let countryB = countryData.find((pais)=>{
            return pais.name.toUpperCase() === guessCountry.toUpperCase();
        })
        if (countryB) {
            let distance = Math.round(getDistance(countryA.latitude, countryA.longitude, countryB.latitude, countryB.longitude));
            let geolibDirection = geolib.getCompassDirection(
                { latitude: (countryB.latitude), longitude: (countryB.longitude) },
                { latitude: (countryA.latitude), longitude: (countryA.longitude) }
            );
            guess[guessNumber].innerText = "El pais a adivinar se encuentra a "+distance+"KM hacia "+arrowDirections[geolibDirection];
            guessNumber++;
            //Get Clues
            compareClues(countryA.name, countryB.name);
        } else {
            Swal.fire({
                title: "ELIGE UN PAÍS",
                text:`Debes elegir un país para jugar`,
                confirmButtonText: "Entiendo",
                confirmButtonColor: "#D90429",
                customClass: {
                    title: "fs-1 fw-bold",
                    htmlContainer: "fs-2",
                    confirmButton: "btn btn-danger fs-2"
                },
                icon: "warning",
                background: (currentTheme === "dark" ? "#161A1D" : "#fff"),
                color: (currentTheme === "dark" ? "#EDF2F4" : "#161A1D")
            })
        }
    } else {
        sendAlert("win");
        const tryCount = guessNumber + 1;
        userStats.guessDistribution[tryCount]++;
        userStats.currentStreak++;
        userStats.playedCount++;
        userStats.winCount++;
        updateStats(userStats);
        //Get clues
        compareClues(countryA.name, countryA.name);
    }
    guessNumber === 6 ? 
        (sendAlert("lose"), 
        userStats.currentStreak = 0, 
        userStats.playedCount++, 
        updateStats(userStats)) : null;
    async function compareClues(country1, country2){
        let countryAClues = await getCountryClues(country1);
        if (country1 == country2){
            //Area
            areaClue.classList.remove("wrong-up", "wrong-down");
            areaClue.classList.add("correct");
            areaClue.innerText = `${countryAClues.area} km²`;
            //Population
            popClue.classList.remove("wrong-up", "wrong-down");
            popClue.classList.add("correct");
            console.log(countryAClues.population);
            if(countryAClues.population > 1000000){
                popClue.innerText = `${countryAClues.population/1000000} M`;
            } else if (countryAClues.population > 100000) {
                popClue.innerText = `${countryAClues.population/100000} K`;
            } else {
                popClue.innerText = `${countryAClues.population}`;
            }
            //Hem
            country1.latitude > 0 ? (hemClue.classList.add("correct"), hemClue.innerText = "NORTE") : (hemClue.classList.add("correct"), hemClue.innerText = "SUR");
            //Continent
            continentClue.classList.add("correct");
            continentClue.innerText = `${countryAClues.region.toUpperCase()}`;
        } else {
            //Consult countryB clues only when needed
            let countryBClues = await getCountryClues(country2);
            //Area
            countryAClues.area > countryBClues.area ? (areaClue.classList.remove("wrong-down"), areaClue.classList.add("wrong-up"), areaClue.innerText = `${countryBClues.area} km²`) : (areaClue.classList.remove("wrong-up"), areaClue.classList.add("wrong-down"), areaClue.innerText = `${countryBClues.area} km²`);
            //Population
            console.log(countryBClues.population);
            console.log(countryAClues.population);
            if(countryAClues.population > countryBClues.population){
                popClue.classList.remove("wrong-down");
                popClue.classList.add("wrong-up");
                if(countryBClues.population > 1000000){
                    popClue.innerText = `${countryBClues.population/1000000} M`;
                } else if (countryBClues.population > 100000) {
                    popClue.innerText = `${countryBClues.population/100000} K`;
                } else {
                    popClue.innerText = `${countryBClues.population}`;
                }
            } else {
                popClue.classList.remove("wrong-up");
                popClue.classList.add("wrong-down");
                if(countryBClues.population > 1000000){
                    popClue.innerText = `${countryBClues.population/1000000} M`;
                } else if (countryBClues.population > 100000) {
                    popClue.innerText = `${countryBClues.population/100000} K`;
                } else {
                    popClue.innerText = `${countryBClues.population}`;
                }
            }
            //Hem
            if(country1.latitude > 0 && country2.latitude > 0) {
                hemClue.classList.add("correct");
                hemClue.innerText = "NORTE";
            } else if (country1.latitude < 0 && country2.latitude < 0){
                hemClue.classList.add("wrong");
                hemClue.innerText = "SUR";
            } else if (country1.latitude < 0 && country2.latitude > 0){
                hemClue.classList.add("wrong");
                hemClue.innerText = "NORTE";
            } else {
                hemClue.classList.add("correct");
                hemClue.innerText = "SUR";
            }
            //Continent
            countryAClues.region != countryBClues.region ? (continentClue.classList.add("wrong"), continentClue.innerText = `${countryBClues.region.toUpperCase()}`) : (continentClue.classList.add("correct"), continentClue.innerText = `${countryBClues.region.toUpperCase()}`);
            
        }
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
    if (alertType === "win"){
        guess[guessNumber].innerText = countryA.name;
        guess[guessNumber].classList.add("win", "fw-bold");
        Swal.fire({
            title: "¡MUY BIEN!",
            text:`El pais a adivinar era ${countryA.name.toUpperCase()}`,
            imageUrl: `https://flagcdn.com/${countryA.code}.svg`,
            imageWidth: "60%",
            imageHeight: "80%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Volver a jugar",
            confirmButtonColor: "#D90429",
            backdrop: "invisible",
            customClass: {
                title: "fs-1 fw-bold",
                htmlContainer: "fs-2",
                confirmButton: "btn btn-danger fs-2",
                cancelButton: "btn btn-secondary fs-2",
                image: "border-dark"
            },
            icon: "success",
            background: (currentTheme === "dark" ? "#161A1D" : "#fff"),
            color: (currentTheme === "dark" ? "#EDF2F4" : "#161A1D")
        }).then((result) =>{
            result.isConfirmed && location.reload();
        })
        makeItRain();
    } else if (alertType === "lose"){
        Swal.fire({
            title: "¡HAS PERDIDO!",
            text:`El pais a adivinar era ${countryA.name.toUpperCase()}`,
            imageUrl: `https://flagcdn.com/${countryA.code}.svg`,
            imageWidth: "60%",
            imageHeight: "80%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            confirmButtonText: "Volver a jugar",
            confirmButtonColor: "#D90429",
            backdrop: "invisible",
            customClass: {
                title: "fs-1 fw-bold",
                htmlContainer: "fs-2",
                confirmButton: "btn btn-danger fs-2",
                cancelButton: "btn btn-secondary fs-2"
            },
            icon: "error",
            background: (currentTheme === "dark" ? "#161A1D" : "#fff"),
            color: (currentTheme === "dark" ? "#EDF2F4" : "#161A1D")
        }).then((result) =>{
            result.isConfirmed && location.reload();
        })
    }
    flag.src = `https://flagcdn.com/${countryA.code}.svg`;
    guessButton.classList.toggle("visually-hidden")
    replayButton.classList.toggle("visually-hidden")
}

function refreshPage(){
    window.location.reload();
}

