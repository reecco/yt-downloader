/* Svg's */
const svg = {
  search: "url(./svg/search.svg)",
  loading: {
    light: "url(./svg/loading-light.svg)",
    black: "url(./svg/loading-black.svg)"
  },
  checked: "url(./svg/check.svg)",
  paste: "url(./svg/paste.svg)",
  clear: "url(./svg/clear.svg)",
  download: "url(./svg/download.svg)",
  language: {
    en: "url(./svg/usa.png)",
    pt: "url(./svg/brazil.png)"
  }
};
/* Svg's */

/* navbar */
const btnLanguage = document.getElementById("btn-language");
const btnHomeItem = document.getElementById("btn-item__home");
const btnAboutItem = document.getElementById("btn-item__about");
const btnConfigItem = document.getElementById("btn-item__config");
const btnPlaylistItem = document.getElementById("btn-item__playlist");
const languageIcon = document.getElementById("language-icon");
const textLanguage = document.getElementById("text-language");
/* navbar */

/* modal */
const modalMessage = document.getElementById("modal-message");
const modal = document.getElementById("modal");
const progress = document.getElementById("modal-progress");
/* modal */

/* main */
const main = document.querySelector("main");
/* main */

/* container-home */
const containerHome = document.getElementById("container-home");
const inputVideo = document.getElementById("url");
const btnPasteVideo = document.getElementById("btn-paste__video");
const btnSearch = document.getElementById("btn-search");
const formats = document.getElementById("format");
const btnDownload = document.getElementById("btn-download");
const video = document.getElementById("video");
const downloadHistory = document.getElementById("title-download__history");
const divDownloadHistory = document.getElementById("download-history");
/* container-home */

/* container-about */
const containerAbout = document.getElementById("container-about");
const information = document.getElementById('info');
const year = document.getElementById("year");
const aboutTitle = document.getElementById("title-about");
const titleText = document.getElementById("title-text");
const textCopy = document.getElementById("text-copy");
const btnCopy = document.getElementById("btn-copy");
/* container-about */

/* container-path */
const containerConfig = document.getElementById("container-config");
const btnSelect = document.getElementById("btn-select");
const textButton = document.getElementById("text-btn");
const downloadPath = document.getElementById("title-download__path");
const folderPathInput = document.getElementById("folder-path");
const inputPath = document.getElementById("input-path");

const titleTheme = document.getElementById("title-theme");
const labelRadioStatic = document.getElementById("title__static");
const labelRadioAnimated = document.getElementById("title__animated");
/* container-path */

/* container-playlist */
const inputPlaylist = document.getElementById("playlist__url");
const btnPastePlaylist = document.getElementById("btn-paste__playlist");
const containerPlaylist = document.getElementById("container-playlist");
const btnSearchPlaylist = document.getElementById("btn-search__playlist");
const itemsBox = document.getElementById("playlist__items-box");
/* container-playlist */

const modalProgress = (attr) => {
  let value = 0;
  progress.value = 0;

  const modalTheme = {
    modalError: {
      class: "error",
      color: "#dc3545"
    },
    modalSuccess: {
      class: "success",
      color: "#28a745"
    }
  }

  const interval = setInterval(() => {
    value += 1;

    progress.value = value;

    for (const theme in modalTheme) {
      if (attr.bgColor == modalTheme[theme].color) {
        progress.classList.add(modalTheme[theme].class);
      }
    }

    modal.style.display = attr.display;
    modal.style.backgroundColor = attr.bgColor;
    modal.style.color = attr.color;
    modal.style.borderColor = attr.borderColor;
    modalMessage.textContent = attr.message;

    if (value >= 100) {
      clearInterval(interval);
      modal.style.display = "none";

      for (const theme in modalTheme) {
        if (attr.bgColor == modalTheme[theme].color) {
          progress.classList.remove(modalTheme[theme].class);
        }
      }
    }
  }, 25);
}