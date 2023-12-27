  import axios from 'axios';
  import path from 'path';
  import fs from 'fs';

  export default {
  config: {
    name: "codm",//api credit to its owner
    aliases: [],
    credits: "kshitiz [Converted by: Rue]",
    version: "2.0",
    cooldown: 5,
    role: 0,
    description: "[get codm video]"
  },

  onCall: async function({ message }) {
    try {

      message.reply(`⏱️ | Loading CODM video...`);

      console.log('Making API request...');

      const response = await axios.get('https://codm-api.diciper09.repl.co/codm/?apikey=umaru852').catch(error => {
        console.error('Error making API request:', error.message);
        throw error;
      });

      console.log('Received API response:', response.data);


      if (response && response.data && response.data.code === 200) {
        const videoUrl = response.data.url;
        const author = response.data.author;


        const videoFileName = path.basename(videoUrl);
        const videoPath = path.join(global.cachePath, videoFileName);

        const videoStream = fs.createWriteStream(videoPath);
        console.log('Downloading video...');

        const videoResponse = await axios({
          method: 'get',
          url: videoUrl,
          responseType: 'stream',
        }).catch(error => {
          console.error('Error downloading video:', error.message);
          throw error;
        });

        videoResponse.data.pipe(videoStream);


        await new Promise((resolve) => {
          videoStream.on('finish', resolve);
        });

        console.log('Video downloaded successfully.');


        console.log('Sending video ...');
        const videoAttachment = fs.createReadStream(videoPath);


        message.reply({
          body: `Call Of Duty Mobile`,
          attachment: videoAttachment
        }, () => {
          fs.unlinkSync(videoPath);
          console.log('Cleaned up: Removed downloaded video.');
        });
      } else {
        console.error('Error: Unable to fetch CODM video');
        message.reply(`❌ | Error fetching CODM video. Please try again later.`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      message.reply(`❌ | An error occurred. Please try again later.`);
    }
  }
};