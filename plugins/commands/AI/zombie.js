import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "zombie",
  version: "1.0.0",
  credits: "Who's Deku (Converted by Grim)",
  description: "Zombie filter",
  usage: "[reply to image or image url]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const { type, messageReply } = message;
  if (type == "message_reply") {
    var t = messageReply.attachments[0].url
  } else {
    var t = args.join(" ");
  }
  try {
    message.reply("Generating...");
    const r = await axios.get("https://free-api.ainz-sama101.repl.co/canvas/toZombie?", {
      params: {
        url: encodeURI(t)
      }
    });
    const result = r.data.result.image_data;
    let ly = path.join(global.cachePath, `${message.threadID}_${Date.now()}_zombie.png`);
    let ly1 = (await axios.get(result, {
      responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(ly, Buffer.from(ly1, "utf-8"));
    return message.reply({ attachment: fs.createReadStream(ly) }, () => fs.unlinkSync(ly))
  } catch (e) {
    console.log(e.message);
    return message.reply("Something went wrong.\n" + e.message)
  }
}