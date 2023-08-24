if (!localStorage.getItem("url_list"))
  localStorage.setItem("url_list", JSON.stringify([]));

const urlList = JSON.parse(localStorage.getItem("url_list"));

const svg = {
  search: "url(./svg/search.svg)",
  loading: {
    light: "url(./svg/loading-light.svg)",
    black: "url(./svg/loading-black.svg)"
  }
};

urlList.reverse().map((url) => {
  const info = document.createElement("div");
  const thumb = document.createElement("div");
  const boxMargin = document.createElement("div");
  const infoBox = document.createElement("div");
  const title = document.createElement("h5");
  const format = document.createElement("p");
  divDownloadHistory.appendChild(info);
  info.appendChild(boxMargin);
  boxMargin.appendChild(thumb);
  boxMargin.appendChild(infoBox);
  boxMargin.className = "box-margin";
  infoBox.appendChild(title);
  infoBox.appendChild(format);
  info.className = "url-box";
  infoBox.className = "info-history";
  title.textContent = url.title.length > 30 ? `${url.title}...` : url.title;
  format.textContent = url.format;
  thumb.style.backgroundImage = url.thumbnail;
  thumb.className = "thumb";
});

function addUrlElementChild(url) {
  if (urlList.length >= 5) {
    urlList.reverse().shift();
  }

  urlList.push(url);

  localStorage.setItem("url_list", JSON.stringify(urlList));
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
  btnSearch.style.backgroundImage = svg.loading.light;
  thumbnail.src = "";
  thumbnail.style.backgroundImage = "none";
  divDownload.style.display = "none";
  video.style.backgroundColor = "transparent";
  video.style.border = "none";

  if (!media.isValidURL(url.value)) {
    setTimeout(() => {
      btnSearch.style.backgroundImage = svg.search;
      message.textContent = language == "en" ? "Invalid URL" : "URL inválida";
      message.style.backgroundColor = "#fa7e7e";
      message.style.border = "1px solid #f85050";
      message.style.color = "#fefefe";
    }, 500);
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
      message.style.border = "none";
    }, 5000);
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
      error.message == "Video unavailable" &&
        language == "pt-br" ? "Vídeo indisponível" :
        error.message;

    message.style.backgroundColor = "#fa7e7e";
    message.style.border = "1px solid #f85050";
    message.style.color = "#fefefe";
  }).finally(() => {
    url.value = "";
    btnSearch.style.backgroundImage = svg.search;
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
      message.style.border = "none";
    }, 5000);
  });
}

btnSearch.addEventListener("click", searchVideo);

function downloadVideo() {
  const url = localStorage.getItem("url");
  const lang = localStorage.getItem("lang") || "en";
  const path = localStorage.getItem("path");
  const format = document.getElementById("format");
  const selectedIndex = format.selectedIndex;
  const selectedFormat = format.options[selectedIndex].value;
  message.textContent = "";
  btnDownload.textContent = language == "en" ? "Downloading..." : "Baixando...";

  if (!url) {
    message.textContent = language == "en" ? "URL not found" : "URl não encontrada";
    message.style.backgroundColor = "red";
    message.textContent = "";
    btnDownload.textContent = language == "en" ? "Download" : "Baixar";
    return;
  }

  media.videoDownload(url, selectedFormat, lang, path).then((response) => {
    message.textContent = response.message;
    message.style.ebackgroundColor = response.status == 200 ? "green" : "red";

    const urlElement = {
      url: url,
      format: selectedFormat,
      thumbnail: document.getElementById("thumbnail").style.backgroundImage,
      title: response.title
    };

    addUrlElementChild(urlElement);
  }).catch((error) => {
    message.textContent = error.message;
    message.style.backgroundColor = "red";
  }).finally(() => {
    btnDownload.textContent = language == "en" ? "Download" : "Baixar";
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
      window.location.reload();
    }, 5000);
  });
}

btnDownload.addEventListener("click", downloadVideo);