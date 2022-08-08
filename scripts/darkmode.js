function changeMode(){
    const element = document.body;
    element.classList.toggle("dark-mode");
}

const switchDarkMode = document.querySelector("#flexSwitchCheckDefault");
switchDarkMode.addEventListener("click", changeMode);