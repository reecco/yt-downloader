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

const theme = localStorage.getItem("theme") || "static";

const radios = {
  static: {
    element: document.getElementById("static-theme")
  },
  animated: {
    element: document.getElementById("animated-theme")
  }
};

for (const radio in radios) {
  radios[radio].element.addEventListener("click", () => {
    if (radios[radio].element.value == "animated") {
      localStorage.setItem("theme", "animated");
      main.classList.add("animated");
      return;
    }

    localStorage.setItem("theme", "static");
    main.classList.remove("animated");
  });
}

if (theme == "static") {
  main.classList.remove("animated");
  radios["static"].element.checked = true;
} else {
  main.classList.add("animated");
  radios["animated"].element.checked = true;
}