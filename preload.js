const { contextBridge } = require("electron");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const os = require("os");

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
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  getVideo: async (url) => {
    const video = await ytdl.getInfo(url);
    console.log(video);

    return {
      title: video.videoDetails.title,
      url: video.videoDetails.video_url,
      embed: video.videoDetails.embed.iframeUrl,
      image: video.videoDetails.thumbnails[0].url.split("?")[0],
      formats: ["mp4", "webm", "mp3"],
      duration: secondsToHours(video.videoDetails.lengthSeconds)
    };
  },
  videoDownload: (url, format = "mp4") => {
    return new Promise(async (resolve, reject) => {
      try {
        const title = (await ytdl.getBasicInfo(url)).videoDetails.title;
        const path = `${os.userInfo().homedir}\\Downloads\\${title}.${format}`;

        if (!title) {
          return reject({
            status: 404,
            message: "Video not found."
          });
        }

        if (!path) {
          return reject({
            status: 404,
            message: "Path not found."
          });
        }

        const chooseFormat =
          format == "mp4" || format == "webm" ? "videoandaudio" : "audioonly";

        const stream = ytdl(url, { filter: chooseFormat, quality: "highest" });

        stream.pipe(fs.createWriteStream(path));

        resolve({
          status: 200,
          message: "Download completed successfully."
        });
      } catch (error) {
        return {
          status: 500,
          message: error.message
        };
      }
    });

    // const video = await ytdl.getInfo(url);
    // const filePath = `${os.userInfo().homedir}\\Downloads\\${video.videoDetails.title}.mp4`;
    // // console.log(ytdl.chooseFormat(video.formats));
    // const formatList = [];
    // video.formats.map(format => {
    //   if (format.mimeType.split(";")[0] === "video/mp4" && format.hasAudio && format.hasVideo) {
    //     formatList.push(format);
    //   }
    // });

    // console.log(formatList);
    // const stream = ytdl(video, format);
    // stream.pipe(fs.createWriteStream(filePath));

    // return new Promise(async (resolve, reject) => {
    //   const video = await ytdl.getInfo(url);
    //   const format = ytdl.chooseFormat(video.formats, { quality: "highest", format: { itag: itag } });
    //   try {
    //     if (!format) {
    //       reject({
    //         code: 400,
    //         message: 'Invalid itag or format not found.'
    //       });
    //       return;
    //     }

    //     const title = video.videoDetails.title;
    //     const filePath = `${os.userInfo().homedir}\\Downloads\\${title}.mp4`;

    //     const stream = ytdl(url, { format: format });

    //     stream.pipe(fs.createWriteStream(filePath));

    //     stream.on("end", () => {
    //       resolve({
    //         code: 200,
    //         message: 'Download completed successfully.'
    //       });
    //     });

    //     stream.on('error', (error) => {
    //       reject({
    //         code: 500,
    //         message: error.message
    //       });
    //     });
    //   } catch (error) {
    //     reject({
    //       code: 500,
    //       message: error.message
    //     });
    //   }
    // });
  }
});