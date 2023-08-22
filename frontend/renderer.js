// const information = document.getElementById('info');
// information.textContent = `This app is using Chrome (v${media.chrome()}), Node.js (v${media.node()}), and Electron (v${media.electron()})`;

let language = "en";
const btnSearch = document.getElementById("btn-search");
const btnDownload = document.getElementById("btn-download");
const btnLanguage = document.getElementById("btn-language");
const btnReload = document.getElementById("btn-reload");
const message = document.getElementById("message");
const video = document.getElementById("video");

(() => {
  btnLanguage.textContent = "English";
})();

// Implementar um tradutor de idioma nesse app
// Implementar uma maneira de decidir se vai baixar um mp3 ou mp4

const isValidUrl = (url) => new RegExp(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url);

function changeLanguage() {
  language = language == "pt-br" ? "en" : "pt-br";
  btnLanguage.textContent = language == "en" ? "English" : "Português";
}

async function searchVideo() {
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

  if (!isValidUrl(url.value)) {
    message.textContent = "Invalid URL.";
    return;
  }

  const value = await media.getVideo(url.value);
  
  title.textContent = value.title;
  duration.textContent = value.duration;

  thumbnail.src = value.image;
  thumbnail.style.backgroundImage = `url(${value.image})`;
  divDownload.style.display = "flex";
  btnDownload.value = "Download";
  video.style.backgroundColor = "#e8edef";
  video.style.border = "1px solid #c4c9cb";

  localStorage.setItem("url", url.value);
  url.value = "";
  btnSearch.style.backgroundImage = "url(./search.svg)";
}

async function downloadVideo() {
  const url = localStorage.getItem("url");
  const format = document.getElementById("format");
  const selectedIndex = format.selectedIndex;
  const selectedFormat = format.options[selectedIndex].value;
  message.textContent = "";
  
  media.videoDownload(url, selectedFormat).then((response) => {
    message.textContent = response.message;
  }).catch((error) => {
    message.textContent = error.message;
  }).finally(() => {
    setTimeout(() => {
      message.textContent = "";
    }, 5000);
  });
}

btnSearch.addEventListener("click", searchVideo);
btnDownload.addEventListener("click", downloadVideo);
btnLanguage.addEventListener("click", changeLanguage);

// btnReload.addEventListener("click", () => window.location.reload());