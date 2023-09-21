const videoPasteOrClear = async () => {
  const inputVideo = document.getElementById("url");

  if (inputVideo.value.length > 0) {
    inputVideo.value = "";
    btnPasteVideo.style.backgroundImage = svg.paste;
  } else {
    const result = await navigator.clipboard.readText();
    inputVideo.value = result;
    btnPasteVideo.style.backgroundImage = svg.clear;
  }
}

inputVideo.addEventListener("input", (event) => {
  const url = event.target.value;

  if (url.length > 0) {
    btnPasteVideo.style.backgroundImage = svg.clear;
  } else {
    btnPasteVideo.style.backgroundImage = svg.paste;
  }
});

function searchVideo() {
  const url = document.getElementById("url");
  const divDownload = document.getElementById("download");
  const thumbnail = document.getElementById("thumbnail");
  const title = document.getElementById("title");
  const duration = document.getElementById("duration");
  modal.style.display = "none";
  title.textContent = "";
  duration.textContent = "";
  localStorage.setItem("url", "");
  divDownload.style.display = "none";
  // btnSearch.style.backgroundImage = svg.loading.light;
  btnSearch.classList.add("loading");
  thumbnail.src = "";
  thumbnail.style.backgroundImage = "none";
  divDownload.style.display = "none";
  video.style.backgroundColor = "transparent";
  video.style.border = "none";
  btnSearch.disabled = true;
  btnSearchPlaylist.disabled = true;

  if (!media.isValidURL(url.value)) {
    setTimeout(() => {
      // btnSearch.style.backgroundImage = svg.search;
      btnSearch.classList.remove("loading");
      const message = language == "en" ? "Please enter a valid URL" : "Por favor, insira uma URL válida";

      modalProgress({ display: "flex", bgColor: "#dc3545", color: "#fefefe", borderColor: "#c41728", message: message });
    }, 500);

    setTimeout(() => {
      btnSearch.disabled = false;
      btnSearchPlaylist.disabled = false;
    }, 3125);
    return;
  }

  media.getVideo(url.value).then((response) => {
    title.textContent = response.title.length > 70 ? `${response.title.slice(0, 70)}...` : response.title;
    title.title = response.title;
    duration.textContent = response.duration;

    thumbnail.src = response.image;
    thumbnail.style.backgroundImage = `url(${response.image})`;
    divDownload.style.display = "flex";
    video.style.backgroundColor = "rgba(232, 237, 239, 0.4)";
    video.style.border = "1px solid #c4c9cb";

    localStorage.setItem("url", url.value);
  }).catch((error) => {
    setTimeout(() => {
      btnSearch.style.backgroundImage = svg.search;
      const message = error.message == "Video unavailable" &&
        language == "pt-br" ? "Vídeo indisponível" :
        error.message;

      modalProgress({ display: "flex", bgColor: "#dc3545", color: "#fefefe", borderColor: "#c41728", message: message });
    }, 500);
  }).finally(() => {
    btnSearch.classList.remove("loading");
    setTimeout(() => {
      btnSearch.disabled = false;
      btnSearchPlaylist.disabled = false;
    }, 3125);
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
  btnDownload.title = language == "en" ? "Downloading" : "Baixando";
  btnSearch.disabled = true;
  btnDownload.disabled = true;

  if (!url) {
    setTimeout(() => {
      btnSearchPlaylist.style.backgroundImage = svg.search;
      const message = language == "en" ? "URL not found" : "URL não encontrada";

      modalProgress({ display: "flex", bgColor: "#dc3545", color: "#fefefe", borderColor: "#c41728", message: message });
      btnDownload.title = language == "en" ? "Download" : "Baixar";
    }, 500);

    setTimeout(() => btnSearch.disabled = false, 3125);
    return;
  }

  btnDownload.classList.add("loading");

  media.videoDownload(url, selectedFormat, lang, path).then((response) => {
    setTimeout(() => {
      const message = response.message;

      modalProgress({ display: "flex", bgColor: "#28a745", color: "#fefefe", borderColor: "#178731", message: message });
    }, 500);
  }).catch((error) => {
    setTimeout(() => {
      // btnSearchPlaylist.style.backgroundImage = svg.search;
      const message = error;

      modalProgress({ display: "flex", bgColor: "#dc3545", color: "#fefefe", borderColor: "#c41728", message: message });
    }, 500);
  }).finally(() => {
    btnDownload.title = language == "en" ? "Download" : "Baixar";
    setTimeout(() => {
      btnSearch.disabled = false;
      btnDownload.disabled = false;
    }, 3125);
  });

  setTimeout(() => btnDownload.classList.remove("loading"), 2000);
}

btnPasteVideo.addEventListener("click", videoPasteOrClear);
btnDownload.addEventListener("click", downloadVideo);