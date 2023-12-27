import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
  name: "remini",
  version: "1.0.0",
  credits: "Who's Deku (Converted by Grim)",
  description: "Remini filter",
  usage: "[reply to image or image url]",
  cooldown: 5,
};

async function onCall({ message, args }) {
  try {
    let imageUrl = args[0];

    if (message.type === "message_reply" && message.messageReply.attachments[0]) {
      imageUrl = message.messageReply.attachments[0].url;
    }

    const waitMessage = await message.reply("⏳ | Enhancing...");
    const response = await axios.get("https://free-api.ainz-sama101.repl.co/canvas/remini", {
      params: {
        url: encodeURI(imageUrl),
      },
    });

    const enhancedImageURL = response.data.result.image_data;
    const cachePath = path.join(global.cachePath, `remini_${message.threadID}.png`);

    const imageBuffer = (await axios.get(enhancedImageURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(cachePath, Buffer.from(imageBuffer, "utf-8"));

    global.api.unsendMessage(waitMessage.messageID);

    return message.reply({ body: "🖼️ | Here's your enhanced image:", attachment: fs.createReadStream(cachePath) }, () => fs.unlinkSync(cachePath));
  } catch (error) {
    console.error(error.message);
    return message.reply("Something went wrong.\n" + error.message);
  }
};

export default { config, onCall };