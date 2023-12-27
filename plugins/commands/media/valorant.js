import axios from 'axios';
import fs from 'fs';

const config = {
  name: 'valorant',
  version: '1.0',
  hasPermission: 0,
  credits: 'HVCKER (Converted by Rue)',
  description: 'Random Valorant Video',
  cooldown: 2,
};

async function onCall({  message }) {
  try {
    message.reply('Hello Players Please Wait..');

    const response = await axios.get('https://valo-api.yodi-iyods.repl.co/video/?apikey=valorant');
    const videoInfo = response.data;

    const videoUrl = videoInfo.url;


    const videoStreamResponse = await axios.get(videoUrl, { responseType: 'stream' });
    const videoData = videoStreamResponse.data;


    const tempFilePath = 'temp_video.mp4';
    const writeStream = fs.createWriteStream(tempFilePath);
    videoData.pipe(writeStream);

    writeStream.on('finish', () => {

      const messages = {
        body: 'Here is your random Valorant video:',
        attachment: fs.createReadStream(tempFilePath),
      };

      message.reply(messages, () => {

        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Error deleting temporary file:', err);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching or sending the video:', error);
    message.reply('Error sending the video.');
  }
};

export default {
  config,
  onCall
}