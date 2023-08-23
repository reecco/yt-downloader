const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

const pagePath = path.join(__dirname, "./frontend/index.html");

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: false,
    icon: path.join(__dirname, "./frontend/youtube.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  window.loadFile(pagePath);
  window.setMenuBarVisibility(true);

  ipcMain.handle('abrirpasta', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });
    if (canceled)
      return;
    
    return filePaths[0];
  })
});