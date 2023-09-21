const { contextBridge, ipcRenderer } = require("electron");
const ytdl = require("ytdl-core");
const fs = require("fs");
const os = require("os");
const ytpl = require("ytpl");

function secondsToHours(seconds) {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`;
  const secondsLeft = date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}` : `${date.getUTCSeconds()}`;

  return hours > 0 ?
    `${hours}:${minutes}:${secondsLeft}` :
    minutes > 0 ?
      `${minutes}:${secondsLeft}` :
      secondsLeft;
}

contextBridge.exposeInMainWorld("media", {
  selectFolder: () => ipcRenderer.invoke('abrirpasta'),
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  isValidURL: (url) => ytdl.validateURL(url),
  getPath: () => {
    return os.platform() == "linux" ?
      `${os.userInfo().homedir}/Downloads/` :
      os.platform() == "win32" ? `${os.userInfo().homedir}\\Downloads\\` :
        undefined;
  },
  getVideo: (url, lang = "en") => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url) {
          return reject({
            status: 400,
            message: lang == "en" ? "Invalid URL" : "URL inválida"
          });
        }

        const video = await ytdl.getInfo(url);

        resolve({
          title: video.videoDetails.title,
          url: video.videoDetails.video_url,
          embed: video.videoDetails.embed.iframeUrl,
          image: video.videoDetails.thumbnails[0].url.split("?")[0],
          formats: ["mp4", "webm", "mp3"],
          duration: secondsToHours(video.videoDetails.lengthSeconds)
        });
      } catch (error) {
        reject({
          status: 500,
          message: error.message
        });
      }
    });
  },
  videoDownload: (url, format = "mp4", lang = "en", path) => {
    return new Promise(async (resolve, reject) => {
      try {
        const title = (await ytdl.getBasicInfo(url)).videoDetails.title;

        if (!path) {
          path = os.platform() == "linux" ?
            `${os.userInfo().homedir}/Downloads/${title}.${format}` :
            os.platform() == "win32" ? `${os.userInfo().homedir}\\Downloads\\${title}.${format}` :
              undefined;
        } else {
          path = os.platform() == "linux" ?
            `${path}/${title}.${format}` :
            os.platform() == "win32" ?
              `${path}\\${title}.${format}` :
              undefined
        }

        if (!title) {
          return reject({
            status: 404,
            message: lang == "en" ? "Video not found" : "Vídeo não encontrado"
          });
        }

        const chooseFormat =
          format == "mp4" || format == "webm" ? "videoandaudio" : "audioonly";

        const chooseQuality =
          format == "mp4" || format == "web" ? "highestvideo" : "highestaudio";

        const stream = ytdl(url, { filter: chooseFormat, quality: "highestvideo", format: { quality: "hd1080" } });

        stream.pipe(fs.createWriteStream(path));

        resolve({
          status: 200,
          title: title,
          message: lang == "en" ? "Download completed successfully." : "Download concluído com sucesso"
        });
      } catch (error) {
        return {
          status: 500,
          message: error.message
        };
      }
    });
  },
  getPlaylist: (url, lang = "en") => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url) {
          return reject({
            status: 400,
            message: lang == "en" ? "Please enter a valid URL" : "Por favor, insira uma URL válida"
          });
        }

        const id = await ytpl.getPlaylistID(url);

        const playlist = await ytpl(id);

        resolve({
          videos: playlist.items,
          title: playlist.title,
          author: playlist.author
        });
      } catch (error) {
        reject({
          status: 500,
          message: error.message
        });
      }
    });
  },
  isValidID: async (url) => {
    try {
      const id = await ytpl.getPlaylistID(url);

      return ytpl.validateID(id);
    } catch (error) {
      return false;
    }
  }
});