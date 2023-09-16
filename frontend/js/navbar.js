const containerMap = {
  home: containerHome,
  about: containerAbout,
  playlist: containerPlaylist,
  config: containerConfig,
};

function showPage(pageName) {
  for (const key in containerMap) {
    containerMap[key].style.display = key === pageName ? "flex" : "none";
  }
  localStorage.setItem("page", pageName);
}

btnHomeItem.addEventListener("click", () => showPage("home"));
btnAboutItem.addEventListener("click", () => showPage("about"));
btnPlaylistItem.addEventListener("click", () => showPage("playlist"));
btnConfigItem.addEventListener("click", () => showPage("config"));

const currentPage = localStorage.getItem("page") || "home";
showPage(currentPage);

btnLanguage.addEventListener("click", () => {
  language == "en" ?
    localStorage.setItem("lang", "pt-br") :
    localStorage.setItem("lang", "en");
  window.location.reload();
});