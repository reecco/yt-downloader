const containerMap = {
  home: {
    container: containerHome,
    button: btnHomeItem
  },
  about: {
    container: containerAbout,
    button: btnAboutItem
  },
  playlist: {
    container: containerPlaylist,
    button: btnPlaylistItem
  },
  config: {
    container: containerConfig,
    button: btnConfigItem
  },
};

function showPage(pageName) {
  for (const key in containerMap) {
    containerMap[key].container.style.display = key === pageName ? "flex" : "none";
    containerMap[key].button.style.fontWeight = key === pageName ? "bold" : "400";
  }
  localStorage.setItem("page", pageName);
}

for (const key in containerMap) {
  containerMap[key].button.addEventListener("click", () => showPage(key));
}

const currentPage = localStorage.getItem("page") || "home";
showPage(currentPage);

btnLanguage.addEventListener("click", () => {
  language == "en" ?
    localStorage.setItem("lang", "pt-br") :
    localStorage.setItem("lang", "en");
  window.location.reload();
});