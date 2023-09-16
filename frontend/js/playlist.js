const randomValue = (value = "") => {
  const values = "abcdefghijklmnopqrstuvwxyz1234567890";

  if (value.length >= 5) {
    return value;
  }

  return randomValue(value += values[Math.floor(Math.random() * values.length)]);
}

async function playlistPasteOrClear() {
  const url = document.getElementById("playlist__url");

  if (url.value.length > 0) {
    url.value = "";
    btnPastePlaylist.style.backgroundImage = svg.paste;
  } else {
    const result = await navigator.clipboard.readText();
    url.value = result;
    btnPastePlaylist.style.backgroundImage = svg.clear;
  }
}

function playlistInputClear() {
  const url = document.getElementById("playlist__url");
  url.value = "";
}

inputPlaylist.addEventListener("input", (event) => {
  const url = event.target.value;

  if (url.length > 0) {
    btnPastePlaylist.style.backgroundImage = svg.clear;
  } else {
    btnPastePlaylist.style.backgroundImage = svg.paste;
  }
});

async function searchPlaylist() {
  const elementsBox = {
    titleBox: document.getElementById("title-box"),
    videosBox: document.getElementById("videos-box"),
    downloadBox: document.getElementById("download-box")
  }

  for (const element in elementsBox) {
    if (elementsBox[element]) {
      const div = elementsBox[element].parentNode;
      div.removeChild(elementsBox[element]);
    }
  }

  btnSearchPlaylist.style.backgroundImage = svg.loading.light;
  const url = document.getElementById("playlist__url").value;

  const result = await media.isValidID(url);

  if (!result) {
    setTimeout(() => {
      btnSearchPlaylist.style.backgroundImage = svg.search;
    }, 500);

    console.log(result);
    return;
  }

  media.getPlaylist(url).then((response) => {
    const titleBox = document.createElement("div");
    titleBox.className = "title-box";
    titleBox.id = "title-box";

    const author = document.createElement("h5");
    author.textContent = response.author.name;

    const name = document.createElement("h6");
    name.textContent = response.title;

    const box = document.createElement("div");
    box.id = "videos-box";

    const downloadBox = document.createElement("div");
    downloadBox.id = "download-box";
    downloadBox.className = "download-box";

    const videos = document.createElement("div");
    videos.className = "videos";
    videos.id = "videos-playlist";

    const btnDownload = document.createElement("button");
    btnDownload.className = "btn__download-playlist";
    btnDownload.id = "btn__download-playlist";
    btnDownload.textContent = language == "en" ? "Download" : "Baixar";

    const formats = ["mp4", "webm", "mp3"];

    const changeOptionAll = document.createElement("select");
    changeOptionAll.id = "change-option-full";
    changeOptionAll.className = "change-option-full";

    formats.map((format) => {
      const optionFormat = document.createElement("option");
      optionFormat.value = format;
      optionFormat.textContent = format.toUpperCase();
      changeOptionAll.appendChild(optionFormat);
    });

    titleBox.appendChild(author);
    titleBox.appendChild(name);

    box.appendChild(videos);

    downloadBox.appendChild(btnDownload);
    downloadBox.appendChild(changeOptionAll);

    changeOptionAll.addEventListener("change", () => {
      const selectedOption = changeOptionAll.value;

      const videoDiv = document.getElementById("videos-playlist");
      const playlist = videoDiv.childNodes;

      playlist.forEach((video) => {
        const format = document.querySelector(`#${video.id} .info-box #format__playlist-video`);

        format.value = selectedOption;
      });
    });

    itemsBox.appendChild(titleBox);
    itemsBox.appendChild(box);
    itemsBox.appendChild(downloadBox);

    response.videos.map((video) => {
      const item = document.createElement("div");
      item.className = "video-item";
      item.id = `video-item-${randomValue()}`;

      const title = document.createElement("h6");
      title.textContent = video.title.length > 40 ? `${video.title.slice(0, 40)}...` : video.title;

      const duration = document.createElement("p");
      duration.textContent = video.duration;

      const input = document.createElement("input");
      input.value = video.shortUrl;
      input.id = "url-hidden";
      input.class = "url-hidden";
      input.type = "hidden";

      const optionsBox = document.createElement("div");
      optionsBox.id = "box-options";
      optionsBox.className = "box-options";

      const formats = ["mp4", "webm", "mp3"];

      const selectFormat = document.createElement("select");
      selectFormat.id = "format__playlist-video";
      selectFormat.className = "format__playlist-video";

      formats.map((format) => {
        const optionFormat = document.createElement("option");
        optionFormat.value = format;
        optionFormat.textContent = format.toUpperCase();
        selectFormat.appendChild(optionFormat);
      });

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "included-video";
      checkbox.className = "included-video";
      checkbox.checked = true;

      optionsBox.appendChild(selectFormat);
      optionsBox.appendChild(checkbox);

      const loading = document.createElement("div");
      loading.id = "loading-video-downloading";
      loading.className = "loading-video-downloading";

      const infoBox = document.createElement("div");
      infoBox.className = "info-box";

      const thumb = document.createElement("div");
      thumb.className = "thumbnail";
      thumb.style.backgroundImage = `url(${video.thumbnails[0].url})`;

      infoBox.appendChild(title);
      infoBox.appendChild(duration);
      infoBox.appendChild(input);
      infoBox.appendChild(optionsBox);
      infoBox.appendChild(loading);

      item.appendChild(thumb);
      item.appendChild(infoBox);

      videos.appendChild(item);
    });

    // console.log(response);

    document.getElementById("btn__download-playlist").addEventListener("click", downloadPlaylist);
  }).catch((error) => {
    console.log("The playlist does not exist");
  }).finally(() => {
    btnSearchPlaylist.style.backgroundImage = svg.search;
  });
}

async function downloadPlaylist() {
  const videoDiv = document.getElementById("videos-playlist");
  const path = localStorage.getItem("path");

  const playlistDiv = videoDiv.childNodes;

  const loadingAll = document.querySelectorAll("#loading-video-downloading");
  loadingAll.forEach((loading) => loading.style.backgroundImage = "none");

  const playlist = [];

  playlistDiv.forEach((video) => playlist.push({
    url: document.querySelector(`#${video.id} .info-box #url-hidden`).value,
    loadingSelector: `#${video.id} .info-box #loading-video-downloading`,
    format: () => {
      const format = document.querySelector(`#${video.id} .info-box .box-options #format__playlist-video`);
      const selectedIndex = format.selectedIndex;
      return format.options[selectedIndex].value;
    },
    included: document.querySelector(`#${video.id} .info-box .box-options #included-video`).checked,
    id: document.getElementById(video.id)
  }));

  for (const video of playlist) {
    const loading = document.querySelector(video.loadingSelector);

    try {
      video.included ?
        (() => {
          loading.style.backgroundImage = svg.loading.black;
          video.id.scrollIntoView({ behavior: "smooth" });
        })() :
        loading.style.backgroundImage = "none";

      await media.videoDownload(video.url, video.format(), "en", path);
    } catch (error) {
      console.error(error);
    } finally {
      video.included ?
        loading.style.backgroundImage = svg.checked :
        loading.style.backgroundImage = "none";
    }
  }
}

btnPastePlaylist.addEventListener("click", playlistPasteOrClear);
btnSearchPlaylist.addEventListener("click", searchPlaylist);