import axios from 'axios';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const config = {
  name: "bardai",
  aliases: [],
  description: "Generate AI response Bard",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "ndt22w",
  extra: {}
};

const onCall = async ({ message, args }) => {
  const prompt = args.join(" ");
  if (!prompt) {
    return message.send("Please ask a question. Use ?bard + question'");
  }
  message.react("🔍");
  const cookie = 'dQimaKzzKoxsFPs2W5R8fo_AWUbFSvmPJv_TpJCoJEN1DLFH6cBLrZFcH1411-GE97N9kQ.'; //add your cookie

  const key = 'SiAMxPublic';

  let params = {
    prompt: encodeURIComponent(prompt),
    cookie: encodeURIComponent(cookie),
    apiKey: encodeURIComponent(key),
    attImage: "",
  };

  if (message.type === "message_reply" && message.messageReply.attachments && message.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(message.messageReply.attachments[0].type)) {
    params.attImage = encodeURIComponent(message.messageReply.attachments[0].url);
  }

  try {
    const response = await axios.get("https://api.siambardproject.repl.co/getBard", { params: params });
    const result = response.data;
    message.react("☑️");
    let content = result.answer;
    let attachment = [];

    if (result.attachment && result.attachment.length > 0) {
      const noSpam = result.attachment.slice(0, 6);

      for (let i = 0; i < noSpam.length; i++) {
        try {
          let imageUrl = noSpam[i];
          let imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          let imageBuffer = Buffer.from(imageResponse.data, 'binary');
          let fileName = `attachment_${i}.png`;
          fs.writeFileSync(fileName, imageBuffer);
          attachment.push(fs.createReadStream(fileName));
        } catch (error) {
          console.error(`Không thể gửi ảnh: ${error}`);
        }
      }
    }

    if (attachment.length > 0) {
      await message.send({
        body: content,
        attachment: attachment,
      });

      for (let i = 0; i < attachment.length; i++) {
        fs.unlinkSync(`attachment_${i}.png`);
      }
    } else {
      await message.send({
        body: content,
      });
    }
  } catch (error) {
    console.error("error", error);
    message.send("error");
  }
};
export default {
  config,
  onCall
};