const ytdl = require("ytdl-core");
const fs = require("fs");

async function videoInfo(url) {
  const info = await ytdl.getBasicInfo(url);

  return info;
}

async function downloadVideo(url, format) {
  const title = (await ytdl.getBasicInfo(url)).videoDetails.title;

  ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(fs.createWriteStream(`${title}.mp3`));
}

module.exports = { videoInfo, downloadVideo }