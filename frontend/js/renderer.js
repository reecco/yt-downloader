if (!localStorage.getItem("url_list"))
  localStorage.setItem("url_list", JSON.stringify([]));

const urlList = JSON.parse(localStorage.getItem("url_list"));

const svg = {
  search: "url(./svg/search.svg)",
  loading: "url(./svg/loading.svg)"
};

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
  btnSearch.style.backgroundImage = svg.loading;
  thumbnail.src = "";
  thumbnail.style.backgroundImage = "none";
  divDownload.style.display = "none";
  video.style.backgroundColor = "transparent";
  video.style.border = "none";

  if (!media.isValidURL(url.value)) {
    setTimeout(() => {
      btnSearch.style.backgroundImage = svg.search;
      message.textContent = language == "en" ? "Invalid URL" : "URL inválida";
      message.style.backgroundColor = "red";
    }, 500);
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
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
      error == "Video unavailable" &&
        language == "pt-br" ? "Vídeo indisponível" :
        error;

    message.style.backgroundColor = "red";
  }).finally(() => {
    url.value = "";
    btnSearch.style.backgroundImage = svg.search;
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
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

  if (!url) {
    message.textContent = language == "en" ? "URL not found" : "URl não encontrada";
    message.style.backgroundColor = "red";
    return;
  }

  media.videoDownload(url, selectedFormat, lang, path).then((response) => {
    message.textContent = response.message;
    message.style.ebackgroundColor = response.status == 200 ? "green" : "red";
  }).catch((error) => {
    message.textContent = error.message;
    message.style.backgroundColor = "red";
  }).finally(() => {
    setTimeout(() => {
      message.textContent = "";
      message.style.backgroundColor = "transparent";
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

btnDownload.addEventListener("click", downloadVideo);