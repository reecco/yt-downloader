// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("API", {
//   setUrl: (args) => {
//     ipcRenderer.invoke("set-url", args);
//   }
// })

const { contextBridge } = require('electron');
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const https = require("https");

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  getVideo: async (url) => {
    const video = await ytdl.getBasicInfo(url);
    console.log(video.videoDetails);
    console.log(video.videoDetails.thumbnails[0].url);

    // const imageUrl = video.videoDetails.thumbnails[0].url.split("?")[0];
    // const imageName = path.join(__dirname, "./output/image/thumb.png");

    // fs.unlink(path.join(__dirname, "./output/image/thumb.png"), (error) => {
    //   if (error)
    //     console.log("File not found.");
    // });

    // const file = fs.createWriteStream();

    // const axioss = new axios.Axios();

    // https.get(imageUrl, response => {
    //   response.pipe(fs.createWriteStream(imageName));
    // }).on('error', err => {
    //   fs.unlink(imageName);
    //   console.error(`Error downloading image: ${err.message}`);
    // });


    // return {
    //   title: video.videoDetails.title,
    //   url: video.videoDetails.video_url,
    //   embed: video.videoDetails.embed.iframeUrl,
    //   image: imageName
    // };

    return new Promise((resolve, _) => {
      const imageUrl = video.videoDetails.thumbnails[0].url.split("?")[0];
      const imageName = path.join(__dirname, "./output/image/thumb.png");

      https.get(imageUrl, response => {
        response.pipe(fs.createWriteStream(imageName));
        resolve({
          title: video.videoDetails.title,
          url: video.videoDetails.video_url,
          embed: video.videoDetails.embed.iframeUrl,
          image: imageName
        })
      }).on('error', err => {
        fs.unlink(imageName);
        console.error(`Error downloading image: ${err.message}`);
      });
    });
  },
  downloadVideo: async (url) => {

  }
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("trustedImageOrigin", "https://i.ytimg.com");