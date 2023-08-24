btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText("https://github.com/reecco/yt-downloader");
  messageCopy.textContent
    = language == "en" ?
      "Copied to clipboard." :
      "Copiado para a área de transferência.";

  setTimeout(() => messageCopy.textContent = "", 5000);
});