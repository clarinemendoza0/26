import axios from 'axios';
import path from 'path';
import fs from 'fs';
import request from 'request';

export default  {
  config: {
    name: "wifey",
    aliases: [],
    version: "1.0",
    credits: "kshitiz (Converted by Grim)",
    cooldown: 20,
    description: "get a temporary wifey",
    usage: "",
  },
  onCall: async function ({ message }) {
    try {

      message.reply("𝘆𝗼𝘂𝗿 𝘁𝗲𝗺𝗽𝗼𝗿𝗮𝗿𝘆 𝘄𝗶𝗳𝗲𝘆 𝗶𝘀 𝗹𝗼𝗮𝗱𝗶𝗻𝗴🥵..");

      const response = await axios.post("https://api--v1-shoti.vercel.app/api/v1/get", {
        apikey: "$shoti-1hecj3cvm6r1mf91948",
      });

      const filePath = path.join(global.cachePath, `${message.threadID}_wifey.mp4`);
      const file = fs.createWriteStream(filePath);

      const rqs = request(encodeURI(response.data.data.url));
      rqs.pipe(file);

      file.on("finish", async () => {

        await message.reply(
          {
            body: `@${response.data.data.user.username}\n𝗗𝗮𝗺𝗻 𝘆𝗼𝘂𝗿 𝘁𝗲𝗺𝗽𝗼𝗿𝗮𝗿𝘆 𝘄𝗶𝗳𝗲𝘆🥵`,
            attachment: fs.createReadStream(filePath),
          }
        );
      });

      file.on("error", (err) => {
        message.reply(`Shoti Error: ${err}`);
      });
    } catch (error) {
      message.reply("An error occurred while generating video:" + error);
    }
  },
};