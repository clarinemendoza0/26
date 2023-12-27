import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "gobard",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ADONIS DEV (ISOY DEV)",
  description: "",
  usePrefix: false,
  commandCategory: "AI",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const question = args.join("");
  const userId = message.senderID;
  if (!question) {
    message.reply('Please Provide A question or query');
  } else {
    try {
      message.reply('Generating Response, Please Wait!!!!');

      if (message.type === "message_reply") {

        if (message.messageReply.attachments && message.messageReply.attachments.length > 0) {
          for (const attachment of message.messageReply.attachments) {
            if (attachment.type === "photo") {
              const largePreviewUrl = attachment.url;
              const filename = attachment.filename;
              const imageResponse = await axios.get(largePreviewUrl, {
                responseType: "arraybuffer",
              });

              fs.writeFileSync(global.cachePath, `${filename}`, Buffer.from(imageResponse.data, "binary"));
              var res = await axios.get(`https://api-bard.easy0.repl.co/api/bard?message=${encodeURIComponent(question)}&url=${encodeURIComponent(attachment.url)}&userID=${encodeURIComponent(userId)}&api=ISOYXD`);
            }
          }
        }
      } else {

        var res = await axios.get(`https://api-bard.easy0.repl.co/api/bard?message=${encodeURIComponent(question)}&userID=${encodeURIComponent(userId)}&api=ISOYXD`);
      }

      const respond = res.data.content;
      const imageUrls = res.data.images;

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {

        const attachments = [];

        for (let i = 0; i < imageUrls.length; i++) {
          const url = imageUrls[i];
          const imagePath = path.join(global.cachePath, `${message.threadID}_gobard_image${i + 1}.png`);

          try {
            const imageResponse = await axios.get(url, {
              responseType: "arraybuffer",
            });

            fs.writeFileSync(imagePath, imageResponse.data);
            attachments.push(fs.createReadStream(imagePath));
          } catch (error) {
            message.reply('Error While Saving Image');
          }
        }

        message.reply({
          body: `${respond}`,
          attachment: attachments,
        });
      } else {
        message.reply(respond);
      }
    } catch (error) {
      message.reply('An error occurred while processing your request');
      console.log(error);
    }
  }
};