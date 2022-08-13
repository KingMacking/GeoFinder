
const switchDarkMode = document.querySelector("#flexSwitchCheckDefault");
const body = document.body;

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark"){
    body.classList.add("dark-mode");
}

switchDarkMode.addEventListener("click", function(){
    body.classList.toggle("dark-mode");

    let theme = "light";
    if (body.classList.contains("dark-mode")){
        theme = "dark";
    }

    localStorage.setItem("theme", theme);
})