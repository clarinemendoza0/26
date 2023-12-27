import axios from 'axios';
import fs from 'fs';
import path from 'path';
import request from 'request';

const config = {
  name: "redroom",
  permissions: [1, 2],
  version: "1.0",
  credits: "Hazeyy",
  description: "( 𝙍𝙖𝙣𝙙𝙤𝙢 𝙎𝙚𝙡𝙓 𝙑𝙞𝙙 )",
  usage: ["redroom"],
  cooldown: 500,
  nsfw: true
};

async function onCall({ api, message }) {
  const threadID = message.threadID;
  try {
    const API_SERVER_URL = 'https://hazeyy-redroom-beta-test-api.kyrinwu.repl.co/api/videosex.php';

    global.api.sendMessage("🕣 | 𝘚𝘦𝘯𝘥𝘪𝘯𝘨 𝘷𝘪𝘥𝘦𝘰...", threadID);

    const response = await axios.get(API_SERVER_URL);
    const responseData = response.data;
    const videoUrl = responseData.data;

    const redroomPath = path.join(
    global.cachePath, `redroom.mp4`
  );
    const file = fs.createWriteStream(redroomPath);
    const rqs = request(encodeURI(videoUrl));

    rqs.pipe(file);

    file.on('finish', async () => {
      const message = {
        body: "Here's your requested video:",
        attachment: fs.createReadStream(redroomPath),
      };
      global.api.sendMessage(message, threadID);
    });
  } catch (error) {
    console.error('😿 Error fetching or sending the video', error);
    global.api.sendMessage("😿 Error sending video", threadID);
  }
}

export default {
  config,
  onCall,
};