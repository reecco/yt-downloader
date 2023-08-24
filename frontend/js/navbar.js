btnHomeItem.addEventListener("click", () => {
  containerHome.style.display = "flex";
  containerAbout.style.display = "none";
  containerConfig.style.display = "none";
});

btnAboutItem.addEventListener("click", () => {
  containerHome.style.display = "none";
  containerAbout.style.display = "flex";
  containerConfig.style.display = "none";
});

btnConfigItem.addEventListener("click", () => {
  containerHome.style.display = "none";
  containerAbout.style.display = "none";
  containerConfig.style.display = "flex";
});

btnLanguage.addEventListener("click", () => {
  language == "en" ?
    localStorage.setItem("lang", "pt-br") :
    localStorage.setItem("lang", "en");
  window.location.reload();
});