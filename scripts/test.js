// let day = prompt("¿En que dia naciste? (En numeros)");
// let month = prompt("¿En que mes naciste? (En numeros)");
// let year = prompt("¿En que año naciste?");
// let birthdate = day + "/" + month + "/" + year;

// alert("Tu fecha de nacimiento es "+birthdate);

// let age = parseInt(prompt("¿Cuantos años tenes?"));
// const nowYear = 2022;
// let birthYear = nowYear * age;
// alert("Naciste en "+birthYear);

const minEntryAge = 18;
const maxEntryAge = 38;
const idName = "Matias";
const idLname = "Atzori";
const moneyNeeded = 330;

let enterTry = 0;

while (enterTry < 2){
    let myAge = parseInt(prompt("¿Cuantos años tenes?"));
    let myName = prompt("¿Cual es tu nombre?");
    let myLname = prompt("¿Cual es tu apellido?");
    let myMoney = parseInt(prompt("¿Cuanto dinero tienes?"));
    if ((myAge<minEntryAge) || (myAge>maxEntryAge)) {
        alert("Tu edad esta fuera de los limites de establecimiento");
        enterTry++;
        continue;
    } else if ((myName!=idName) || (myLname!=idLname)) {
        alert("Tu nombre no coincide con tu credencial");
        enterTry++;
        continue;
    } else if (myMoney<moneyNeeded) {
        alert("No posees el dinero para abonar la entrada");
        enterTry++;
    } else {
        alert("Puedes pasar");
        break;
    }
}
if (enterTry==2){
    alert("No puedes entrar al establecimiento, vuelve otro dia")
}



