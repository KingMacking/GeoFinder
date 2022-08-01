import {countryData} from './countries.js'
//Constructor de paises del juego
// class Country {
//     constructor(name, latitude, longitude, code) {
//         this.name = name;
//         this.latitude = latitude;
//         this.longitude = longitude;
//         this.code = code;
//     }

//     getName(){
//         console.log(this.name);
//     }
//     getLatitude(){
//         console.log(this.latitude);
//     }
//     getLongitude(){
//         console.log(this.longitude);
//     }
//     getCode(){
//         console.log(this.code);
//     }
// }

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

function compareCountries(){
    let countryA = countryData[Math.round(Math.random()*countryData.length)];
    console.log(countryA)
    for (let errorCount = 0; errorCount<5 ; errorCount++) {
        let guessCountry = prompt("Adivina el pais, los nombres estan en su mayoria en ingles.");
        console.log(guessCountry);
        if (guessCountry.toUpperCase() != (countryA.name).toUpperCase()) {
            let countryB = countryData.find((pais)=>{
                return pais.name.toUpperCase() == guessCountry.toUpperCase();
            })
            if (countryB) {
                let distance = Math.round(getDistance(countryA.latitude, countryA.longitude, countryB.latitude, countryB.longitude));
                let direction = getDirection(countryA.latitude, countryA.longitude, countryB.latitude, countryB.longitude);
                alert("El pais a adivinar se encuentra a "+distance+"KM hacia "+direction);
            } else {
                alert("El pais ingresado no existe o esta mal escrito")
            }
        } else {
            alert("¡Muy bien!\nEl pais a adivinar era " + countryA.name);
            break;
        }
        if (errorCount == 5) {
            alert("Has errado 5 veces por lo tanto has perdido la partida, vuelve a intentarlo :)");
        }
    }
}
compareCountries();