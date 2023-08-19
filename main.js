const { app, BrowserWindow, ipcMain } = require("electron");
// const ytdl = require("ytdl-core");
const { videoInfo, downloadVideo } = require("./video");
const path = require("path");

const pagePath = path.join(__dirname, "./frontend/index.html")

const createWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./frontend/youtube.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  window.loadFile(pagePath);
  window.setMenuBarVisibility(true);
}

app.whenReady().then(() => {
  createWindow();
});