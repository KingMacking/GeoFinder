import {countryData} from './countries.js'

//-----Variables-----
const guess = document.querySelectorAll(".guess");
const guessButton = document.querySelector("#btnGuess");
const countrySelect = document.querySelector("#countrySelect");
const guesses = document.querySelector("#guesses");
const flag = document.querySelector("#flag-image")

let guessNumber = 0
let countryA = countryData[Math.round(Math.random()*countryData.length)];
console.log(countryA);

//-----Events-----
guessButton.addEventListener("click", compareCountries);

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
        guess[guessNumber].innerText = "¡Muy bien! El pais a adivinar era " + countryA.name
        guess[guessNumber].classList.add("win", "fw-bold");
        guessButton.disabled = true;
        flag.src = `https://flagcdn.com/${countryA.code}.svg`
    }
    if (guessNumber==6){
        guessButton.disabled = true;
        let loseAlert = document.createElement("div");
        loseAlert.innerText = `¡Has perdido! El pais a adivinar era ${countryA.name.toUpperCase()}`
        loseAlert.classList.add("guess", "p-3", "text-center", "lose", "mt-4", "fw-bold", "h-auto");
        guesses.appendChild(loseAlert);
        flag.src = `https://flagcdn.com/${countryA.code}.svg`
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

//Replace incognito flag with country flag
function replaceFlag (){

}