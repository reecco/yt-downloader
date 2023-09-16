if (!localStorage.getItem("path")) {
  const path = media.getPath();
  localStorage.setItem("path", path);
  inputPath.value = path;
}

inputPath.value = localStorage.getItem("path");

function folderPath() {
  window.media.selectFolder().then(result => {
    if (!result)
      result = media.getPath();

    inputPath.value = result;
    localStorage.setItem("path", result);
  });
}

btnSelect.addEventListener("click", folderPath);