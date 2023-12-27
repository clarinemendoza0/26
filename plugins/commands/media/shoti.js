import axios from 'axios';
import fs from 'fs';
import request from 'request';
import path from 'path';

const config = {
  name: 'shoti',
  aliases: [''],
  permissions: [0, 1, 3],
  version: '1.0',
  cooldown: 10,
  usage: "",
  credits: "Grim"
};

async function onCall({ message }) {
  await message.react("⏳");
  try {
    let response = await axios.post('https://api--v1-shoti.vercel.app/api/v1/get', {
      apikey: 'shoti-1ha4h3do8at9a7ponr',
    });

    if (response.data.code === 200 && response.data.data && response.data.data.url) {
      const videoUrl = response.data.data.url;
      const filePath = path.join(global.cachePath, `shoti_${message.messageID}.mp4`);
      const file = fs.createWriteStream(filePath);
      const rqs = request(encodeURI(videoUrl));

      rqs.pipe(file);

      file.on('finish', async () => {
        const userInfo = response.data.data.user;
        const username = userInfo.username;
        const nickname = userInfo.nickname;

        message.react("☑️");
        await message.reply({
          body: `Username: @${username}\nNickname: ${nickname}`,
          attachment: fs.createReadStream(filePath)
        });
      });
    } else {
      message.react("⚠️");
      message.reply('No video URL found in the API response.');
    }

  } catch (error) {
    message.react("❎");
    console.error(error);
    message.reply('An error occurred while fetching the video.');
  }
};

export default {
  config,
  onCall
}