import {countryData} from './countries.js';
import {userStats, updateStats, showStatsModal} from './stats.js';
// import {getCompassDirection} from '../node_modules/geolib/es/getCompassDirection.js';
// console.log(getCompassDirection)
// const geolib = require('geolib');

//-----Variables-----
const guess = document.querySelectorAll(".guess");
const guessButton = document.querySelector("#btnGuess");
const countrySelect = document.querySelector("#countrySelect");
const flag = document.querySelector("#flag-image");
const statsButtonOpen = document.querySelector("#stats-button");
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
// const geolib = require('geolib');

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
    return guessOption;
}

//Compare countries to obtain data
function compareCountries(){
    let guessCountry = getSelectedCountry();
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
    }
    guessNumber === 6 ? 
        (sendAlert("lose"), 
        userStats.currentStreak = 0, 
        userStats.playedCount++, 
        updateStats(userStats)) : null;

    
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
    guessButton.disabled = true;
}

// const saveLocal = (key, value) => {localStorage.setItem(key, value)};
