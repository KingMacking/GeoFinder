//Used variables
const switchDarkMode = document.querySelector("#flexSwitchCheckDefault");
const body = document.body;

//Get theme from localstorage
const currentTheme = localStorage.getItem("theme");
currentTheme === "dark" && (body.classList.add("dark-mode"), switchDarkMode.checked = true);

//Switch button
switchDarkMode.addEventListener("click", function(){
    body.classList.toggle("dark-mode");

    let theme = "light";
    body.classList.contains("dark-mode") && (theme = "dark");

    localStorage.setItem("theme", theme);
})