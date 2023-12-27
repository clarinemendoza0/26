import axios from 'axios';
import fs from 'fs';
import path from 'path';

const history = {};
let isFontEnabled = true;

export const config = {
  name: "nyx",
  version: "3.1",
  credits: "Hazeyy",
  description: "( 𝙰𝙸-𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍 𝚡 𝙰𝚞𝚍𝚒𝚘 𝚝𝚘 𝚃𝚎𝚡𝚝 𝚊𝚗𝚍 𝙸𝚖𝚊𝚐𝚎 𝙿𝚛𝚘𝚖𝚙𝚝 )",
  usage: "( 𝙳𝚊𝚝𝚎 𝚘𝚛 𝙰𝚜𝚔 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗𝚜 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍 )",
  cooldown: 3,
};

async function handleNyxImageCommand(message) {
  const args = message.body.split(/\s+/);
  args.shift();
  const tzt = args.join(' ').split('-').map(item => item.trim());
  const txt = tzt[0];
  const txt2 = tzt.slice(1).join(' ');

  if (!txt || !txt2) {
    return message.reply("🎀 𝙷𝚎𝚕𝚕𝚘 𝚝𝚘 𝚞𝚜𝚎 𝙽𝚢𝚡 𝙰𝙸 𝚠𝚒𝚝𝚑 𝚙𝚛𝚘𝚖𝚙𝚝.\n\n𝚄𝚜𝚎: 𝚗𝚢𝚡 𝚒𝚖𝚊𝚐𝚎 [ 𝚙𝚛𝚘𝚖𝚙𝚝 ] - [ 𝚖𝚘𝚍𝚎𝚕 ] 𝚋𝚎𝚝𝚠𝚎𝚎𝚗 1-20.");
  }

  const wait = await message.reply("🗨️ | 𝙽𝚢𝚡 𝙰𝙸 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚙𝚛𝚘𝚖𝚙𝚝, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...");

  try {
    const enctxt = encodeURI(txt);
    const url = `https://hazeyy-api-img-prompt.kyrinwu.repl.co/api/img/prompt?prompt=${enctxt}&model=${txt2}`;
    const responses = await Promise.all(
      Array.from({ length: 4 }, async (_, index) => {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
      })
    );

    const paths = [];

    responses.forEach((data, index) => {
      const pathImg = path.join(global.cachePath, `image_nyx_${index + 1}.png`);
      fs.writeFileSync(pathImg, Buffer.from(data, "binary"));
      paths.push(pathImg);
    });

    const senderName = "🎀 𝙽𝚢𝚡 ( 𝙰𝙸 )";
    const messages = `${senderName}\n\n𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚒𝚖𝚊𝚐𝚎 𝚙𝚛𝚘𝚖𝚙𝚝`;

    const combinedMessage = {
      body: messages,
      attachment: paths.map((pathImg) => fs.createReadStream(pathImg)),
    };

    global.api.unsendMessage(wait.messageID);
    message.reply(combinedMessage, () => paths.forEach(fs.unlinkSync));
  } catch (e) {
    message.reply("🚫 | 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝚒𝚖𝚊𝚐𝚎 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚘𝚗");
  }
}

async function convertVoiceToText(audioUrl, message) {
  try {
    const wait = await message.reply("💽 | 𝙽𝚢𝚡 𝙰𝙸 𝙲𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚗𝚐 𝙰𝚞𝚍𝚒𝚘, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...");

    const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/try/voice2text?url=${encodeURIComponent(audioUrl)}`);
    const text = response.data.transcription;

    if (text && isFontEnabled) {
      const formattedText = formatFont(text);
      message.reply(`🎀 | 𝙽𝚢𝚡 ( 𝙰𝙸 ) 𝙲𝚘𝚗𝚃𝚎𝚡𝚝 🎶\n\n ${formattedText}`);
    } else if (text) {
      global.api.unsendMessage(wait.messageID);
      message.reply(`🎀 | 𝙽𝚢𝚡 ( 𝙰𝙸 ) 𝙲𝚘𝚗𝚃𝚎𝚡𝚝 🎶\n\n ${text}`);
    } else {
      message.reply("🚫 | 𝚄𝚗𝚊𝚋𝚕𝚎 𝚝𝚘 𝚌𝚘𝚗𝚟𝚎𝚛𝚝 𝚊𝚞𝚍𝚒𝚘.");
    }
  } catch (error) {
    console.error("🚫 | 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚗𝚐 𝚊𝚞𝚍𝚒𝚘:", error);
    message.reply("🚫 | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚗𝚐 𝚊𝚞𝚍𝚒𝚘.");
  }
}

export async function onCall({ message, Users }) {
  const args = message.body.split(/\s+/);
  args.shift();

  if (message.type === "message_reply") {
    if (message.messageReply.attachments[0]) {
      const attachment = message.messageReply.attachments[0];

      if (attachment.type === "audio") {
        const audioUrl = attachment.url;
        await convertVoiceToText(audioUrl, message);
        return;
      }
    }
  }

  let text = args.join(" ");

  if (!text) {
    return message.reply("🎀 | 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙽𝚢𝚡 𝙰𝙸 𝚢𝚘𝚞𝚛 𝚟𝚒𝚛𝚝𝚞𝚊𝚕 𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍.\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 ( 𝚀𝚞𝚎𝚛𝚢 ) 𝚝𝚘 𝚜𝚎𝚊𝚛𝚌𝚑 𝚘𝚛 𝚝𝚘 𝚝𝚊𝚕𝚔 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍.");
  }

  const command = args.shift(); // Extract the first word after "nyx"

  if (command.toLowerCase() === "image") {
    handleNyxImageCommand(message);
    return;
  }

  if (!history.hasOwnProperty(message.senderID)) history[message.senderID] = [];
  history[message.senderID].push({ role: "user", content: text });

  try {
    const wait = await message.reply("🗨️ | 𝙽𝚢𝚡 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐...");

    let senderName = (await global.controllers.Users.getData(message.senderID)).name;

    let { data } = await axios.post("https://hazeyy-apis-combine.kyrinwu.repl.co/api/girlfriend", { messages: history[message.senderID], sender_name: senderName });

    if (data && data.content) {
      history[message.senderID].push(data);

      const formattedResponse = isFontEnabled ? `🎀 | 𝙽𝚢𝚡 ( 𝙰𝙸 )\n\n❓ 𝙰𝚜𝚔: '${text}'\n\n${formatFont(data.content)}` : `🎀 | 𝙽𝚢𝚡 ( 𝙰𝙸 )\n\n❓ 𝙰𝚜𝚔: '${text}'\n\n${data.content}`;
      global.api.unsendMessage(wait.messageID);
      message.reply(formattedResponse);
    } else {
      message.reply("🚫 | 𝙰𝙿𝙸 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚒𝚜 𝚎𝚖𝚙𝚝𝚢 𝚘𝚛 𝚞𝚗𝚍𝚎𝚏𝚒𝚗𝚎𝚍.");
    }
  } catch (error) {
    console.error("🚫 | 𝙴𝚛𝚛𝚘𝚛 𝚍𝚞𝚛𝚒𝚗𝚐 𝙰𝙿𝙸 𝚛𝚎𝚚𝚞𝚎𝚜𝚝:", error);
    return message.reply("🚫 | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚛𝚎𝚚𝚞𝚎𝚜𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.");
  }
};

function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    formattedText += char in fontMapping ? fontMapping[char] : char;
  }

  return formattedText;
      }