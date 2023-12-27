import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';

const config = {
  name: "youtube",
  version: "1.3.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Access YouTube",
  usage: "[video name]",
  cooldown: 5,
};

async function onCall({ message, args }) {
  const videoName = args.join(" ");
  if (!videoName) return message.reply("Please provide a search query for the YouTube video.");

  try {
    message.react("⏸️");
    const { data } = await axios.post('https://youtube.team-august.repl.co/searchVideo', { videoName });
    const { title, description, duration, views, thumbnail, url, error } = data;
    if (error) {
      console.error('ERROR', error);
      return message.reply(`An error occurred: ${error}`);
    }

    const wait = await message.reply(`Sending "${title}", please be patient...`);

    const videoStream = ytdl(url, { quality: 'highest', filter: 'audioandvideo' });
    const filePath = path.join(global.cachePath, `${message.threadID}_${Date.now()}_${title}.mp4`);
    const writeStream = fs.createWriteStream(filePath);

    videoStream.pipe(writeStream);

    writeStream.on('finish', () => {
      const messages = {
        body: `🎞️ 𝗛𝗘𝗥𝗘'𝗦 𝗧𝗛𝗘 𝗥𝗘𝗦𝗨𝗟𝗧\n\n𝗧𝗜𝗧𝗟𝗘: ${title}\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${description}\n𝗗𝗨𝗥𝗔𝗧𝗜𝗢𝗡: ${duration}\n𝗩𝗜𝗘𝗪𝗦: ${views}\n𝗧𝗛𝗨𝗠𝗕𝗡𝗔𝗜𝗟: ${thumbnail}`,
        attachment: fs.createReadStream(filePath),
      };

      message.react("▶️");
      global.api.unsendMessage(wait.messageID);
      message.reply(messages, async () => {
        if (fs.existsSync(filePath)) await fs.unlink(filePath);
      });
    });
  } catch (error) {
    console.error('ERROR', error);
    message.reply('An error occurred while processing the command.');
  }
}

export default { config, onCall };