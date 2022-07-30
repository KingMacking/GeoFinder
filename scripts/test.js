import {countryData} from './countries.js'
//Constructor de paises del juego
class Country {
    constructor(name, latitude, longitude, code) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.code = code;
    }

    getName(){
        console.log(this.name);
    }
    getLatitude(){
        console.log(this.latitude);
    }
    getLongitude(){
        console.log(this.longitude);
    }
    getCode(){
        console.log(this.code);
    }
}

const country1 = new Country("Argentina", -38.416097, -63.616672, "AR");
const country2 = new Country("Belgium", 50.503887, 4.469936, "BE");
const country3 = new Country("Brazil", -14.235004, -51.92528, "BR");
const country4 = new Country("United Kingdom", 55.378051, -3.435973, "GB");
const country5 = new Country("Italy", 41.87194, 12.56738, "IT");

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

function compareCountries(){
    let North = "⬆️";
    let East = "➡️";
    let West = "⬅️";
    let South = "⬇️";
    let SouthEast = "↘️";
    let SouthWest = "↙️";
    let NorthEast = "↗️";
    let NorthWest = "↖️";

    let errorCount = 0;

    const countryA = country1;
    for (let errorCount = 0; errorCount<5 ; errorCount++) {
        let countryB = prompt("Adivina el pais, tus opciones son: Argentina, Belgium, Brazil, United Kingdom, Italy")
        if (countryA.name != countryB){
            if (countryB === country2.name) {
                distance = Math.round(getDistance(countryA.latitude, countryA.longitude, country2.latitude, country2.longitude));
                alert("El pais se encuentra "+distance+"KM mas hacia "+SouthWest);
            } else if (countryB === country3.name) {
                distance = Math.round(getDistance(countryA.latitude, countryA.longitude, country3.latitude, country3.longitude));
                alert("El pais se encuentra "+distance+"KM  mas hacia "+South);
            } else if (countryB === country4.name) {
                distance = Math.round(getDistance(countryA.latitude, countryA.longitude, country4.latitude, country4.longitude));
                alert("El pais se encuentra "+distance+"KM  mas hacia "+SouthWest);
            } else if (countryB === country5.name) {
                distance = Math.round(getDistance(countryA.latitude, countryA.longitude, country5.latitude, country5.longitude));
                alert("El pais se encuentra "+distance+"KM  mas hacia "+SouthWest);
            } else {
                alert("Debes ingresar un pais de la lista");
            }
        } else {
            alert("¡Correcto, el pais a adivinar era Argentina!");
            break;
        }
        // if (errorCount == 5) {
        //     alert("Has errado 5 veces por lo tanto has perdido la partida, vuelve a intentarlo :)");
        // }
    }
}

compareCountries();
// let countries = Object.keys(countryData);
// alert(countries[Math.round(Math.random()*countries.length)])
