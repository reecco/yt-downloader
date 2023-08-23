// const information = document.getElementById('info');
// information.textContent = `This app is using Chrome (v${media.chrome()}), Node.js (v${media.node()}), and Electron (v${media.electron()})`;

let language;

if (!localStorage.getItem("url_list"))
  localStorage.setItem("url_list", JSON.stringify([]));

const urlList = JSON.parse(localStorage.getItem("url_list"));

const btnLanguage = document.getElementById("btn-language");
const aboutItem = document.getElementById("item-about");
const btnSearch = document.getElementById("btn-search");
const btnDownload = document.getElementById("btn-download");
const message = document.getElementById("message");
const video = document.getElementById("video");
const downloadHistory = document.getElementById("title-download__history");

function languagePage() {
  language = localStorage.getItem("lang");

  if (!language)
    localStorage.setItem("lang", "en");

  aboutItem.textContent = language == "en" ? "About" : "Sobre";
  aboutItem.title = language == "en" ? "About" : "Sobre";

  btnLanguage.textContent = language == "en" ? "EN" : "PT-BR";
  btnLanguage.title = language == "en" ? "Mudar para português" : "Change to english";

  btnDownload.textContent = language == "en" ? "Download" : "Baixar";

  downloadHistory.textContent = language == "en" ? "Download history" : "Histórico de download";
}

function changeLanguage() {
  language == "en" ? localStorage.setItem("lang", "pt-br") : localStorage.setItem("lang", "en");
  window.location.reload();
}

function searchVideo() {
  const url = document.getElementById("url");
  const divDownload = document.getElementById("download");
  const thumbnail = document.getElementById("thumbnail");
  const title = document.getElementById("title");
  const duration = document.getElementById("duration");
  message.textContent = "";
  title.textContent = "";
  duration.textContent = "";
  localStorage.setItem("url", "");
  divDownload.style.display = "none";
  btnSearch.style.backgroundImage = "url(./loading.svg)";
  thumbnail.src = "";
  thumbnail.style.backgroundImage = "none";
  divDownload.style.display = "none";
  video.style.backgroundColor = "transparent";
  video.style.border = "none";

  if (!media.isValidURL(url.value)) {
    setTimeout(() => {
      btnSearch.style.backgroundImage = "url(./search.svg)";
      message.textContent = language == "en" ? "Invalid URL" : "URL inválida";
    }, 500);
    setTimeout(() => message.textContent = "", 5000);
    return;
  }

  media.getVideo(url.value).then((response) => {
    title.textContent = response.title.length > 70 ? `${response.title.slice(0, 70)}...` : response.title;
    title.title = response.title;
    duration.textContent = response.duration;

    thumbnail.src = response.image;
    thumbnail.style.backgroundImage = `url(${response.image})`;
    divDownload.style.display = "flex";
    btnDownload.value = "Download";
    video.style.backgroundColor = "#e8edef";
    video.style.border = "1px solid #c4c9cb";

    localStorage.setItem("url", url.value);
  }).catch((error) => {
    message.textContent =
      error == "Video unavailable" &&
        language == "pt-br" ? "Vídeo indisponível" :
        error;
  }).finally(() => {
    url.value = "";
    btnSearch.style.backgroundImage = "url(./search.svg)";
    setTimeout(() => {
      message.textContent = "";
    }, 5000);
  });
}

function downloadVideo() {
  const url = localStorage.getItem("url");
  const lang = localStorage.getItem("lang") || "en";
  const format = document.getElementById("format");
  const selectedIndex = format.selectedIndex;
  const selectedFormat = format.options[selectedIndex].value;
  message.textContent = "";

  if (!url) {
    message.textContent = language == "en" ? "URL not found" : "URl não encontrada";
    return;
  }

  media.videoDownload(url, selectedFormat, lang).then((response) => {
    message.textContent = response.message;
  }).catch((error) => {
    message.textContent = error.message;
  }).finally(() => {
    setTimeout(() => {
      message.textContent = "";
    }, 5000);
  });

  if (urlList.length >= 5) {
    urlList.shift();
  }

  urlList.push({
    url: url,
    format: selectedFormat,
    thumbnail: document.getElementById("thumbnail").style.backgroundImage
  });

  localStorage.setItem("url_list", JSON.stringify(urlList));
}

btnSearch.addEventListener("click", searchVideo);
btnDownload.addEventListener("click", downloadVideo);
btnLanguage.addEventListener("click", changeLanguage);
languagePage();

const folderPathInput = document.getElementById("folder-path");
const btnSelect = document.getElementById("btn-select");
const viewPath = document.getElementById("view-path");

btnSelect.addEventListener("click", () => {
  window.media.selectFolder().then(result => console.log(result));
});

folderPathInput.addEventListener("change", (event) => {
  const seletedPath = event.target.files[0].path;
  viewPath.textContent = seletedPath;
  console.log(seletedPath);
});