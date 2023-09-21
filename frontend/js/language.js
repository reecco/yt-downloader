let language = localStorage.getItem("lang");

if (!language)
  localStorage.setItem("lang", "en");

language = localStorage.getItem("lang");
document.documentElement.lang = language;

/* Navbar */
btnAboutItem.textContent = language == "en" ? "About" : "Sobre";
btnAboutItem.title = language == "en" ? "About" : "Sobre";
btnConfigItem.title = language == "en" ? "Settings" : "Configurações";
// btnLanguage.textContent = language == "en" ? "EN" : "PT-BR";
textLanguage.textContent = language == "en" ? "EN" : "PT-BR";
languageIcon.style.backgroundImage = language == "en" ? svg.language.en : svg.language.pt;
btnLanguage.title = language == "en" ? "Mudar para português" : "Change to english";
/* Navbar */

/* container-home */
inputVideo.placeholder = language == "en" ? "Paste video link here" : "Cole o link do vídeo aqui";
formats.title = language == "en" ? "Select a format" : "Selecione um formato";
btnDownload.title = language == "en" ? "Download" : "Baixar";
/* container-home */

/* container-about */
aboutTitle.textContent =
  language == "en" ?
    "About" :
    "Sobre";

information.textContent =
  language == "en" ?
    `This app is using Chrome (v${media.chrome()}), Node.js (v${media.node()}) and Electron (v${media.electron()})` :
    `Esse aplicativo está usando Chrome (v${media.chrome()}), Node.js (v${media.node()}) e Electron (v${media.electron()})`;

year.textContent = new Date().getUTCFullYear();

titleText.textContent =
  language == "en" ?
    "Youtube Downloader is an open source desktop project to download Youtube videos in MP4, MP3 and WEBM formats." :
    "Youtube Downloader é um projeto desktop de código aberto para baixar vídeos do Youtube nos formatos MP4, MP3 e WEBM.";

textCopy.textContent =
  language == "en" ?
    "Project repository available on" :
    "Repositório do projeto disponível em";
/* container-about */

/* container-config */
downloadPath.textContent = language == "en" ? "Destination folder" : "Pasta de destino";
textButton.textContent = language == "en" ? "Select folder" : "Selecionar pasta";

titleTheme.textContent = language == "en" ? "Change theme" : "Mudar tema";
labelRadioStatic.textContent = language == "en" ? "Static" : "Estático";
labelRadioAnimated.textContent = language == "en" ? "Animated" : "Animado";
/* container-config */

/* container-playlist */
inputPlaylist.placeholder = language == "en" ? "Paste playlist link here" : "Cole o link da playlist aqui";
/* container-playlist */