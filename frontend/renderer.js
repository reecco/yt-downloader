// const url = document.getElementById("url");

// function handleOnChange({ target: { value } }) {
//   window.API.setUrl(value);
// }

// url.addEventListener("change", handleOnChange);

// const url = document.getElementById("url");
// const submitButton = document.getElementById("search");
// const valorExibido = document.getElementById('view');

// function handleOnClick() {
//   const value = url.value;
//   // window.API.setUrl(value);

//   // Solicitar o valor do processo principal
//   // ipcRenderer.send('get-value-request');

//   // // Lidar com a resposta do processo principal
//   // ipcRenderer.on('get-value-reply', (event, valor) => {
//   //   valorExibido.textContent = `O valor é: ${valor}`;
//   // });
// }

// submitButton.addEventListener("click", handleOnClick);

const information = document.getElementById('info')
information.textContent = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const search = document.getElementById("search");

async function searchVideo() {
  const url = document.getElementById("url").value;
  const imageVideo = document.getElementById("image-video");

  const videoTitle = document.getElementById("video-title");
  videoTitle.textContent = "";

  // videoTitle.textContent = url;

  // const value = await versions.getVideo(url);

  // imageVideo.setAttribute("src", value.image);
  // console.log(value.image);

  // videoTitle.textContent = value.title;

  await versions.getVideo(url).then(value => {
    imageVideo.setAttribute("src", value.image);
    console.log(value.image);

    videoTitle.textContent = value.title;
  });
}

search.addEventListener("click", searchVideo);