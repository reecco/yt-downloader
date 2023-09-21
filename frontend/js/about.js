btnCopy.addEventListener("click", () => {
  btnCopy.disabled = true;
  navigator.clipboard.writeText("https://github.com/reecco/yt-downloader");
  const message = language == "en" ?
      "Copied to clipboard." :
      "Copiado para a área de transferência.";

  modalProgress({ display: "flex", bgColor: "#28a745", color: "#fefefe", borderColor: "#178731", message: message });

  setTimeout(() => btnCopy.disabled = false, 3125);
});