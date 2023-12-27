import axios from 'axios';
const monitoredURLs = new Set();

export const config = {
  name: "monitor",
  version: "3.1",
  credits: "Hazeyy (Converted by Grim)",
  description: "( 𝙈𝙤𝙣𝙞𝙩𝙤𝙧 𝙍𝙚𝙥𝙡'𝙨 )",
  usage: "[url] ",
  cooldown: 5,
};

export async function onCall({ message }) {
  const { body } = message;

  const args = body.split(/\s+/);
  args.shift();

  if (args.length < 1) {
    message.reply("🗨️ | 𝖴𝗌𝖺𝗀𝖾: 𝗆𝗈𝗇𝗂𝗍𝗈𝗋 [ 𝗎𝗋𝗅 ] 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 𝗆𝗈𝗇𝗂𝗍𝗈𝗋𝗂𝗇𝗀");
    return;
  }

  const url = args[0];

  if (monitoredURLs.has(url)) {
    message.reply(`⚠️ | ${url} 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖻𝖾𝗂𝗇𝗀 𝗆𝗈𝗇𝗂𝗍𝗈𝗋𝖾𝖽.`);
    return;
  }

  try {
    monitoredURLs.add(url);
    const wait = await message.reply(`🕟 | 𝖠𝖽𝖽𝗂𝗇𝗀 𝖴𝖱𝖫 𝗍𝗈 𝗍𝗁𝖾 𝗆𝗈𝗇𝗂𝗍𝗈𝗋𝗂𝗇𝗀 𝗅𝗂𝗌𝗍...`);

    setTimeout(async () => {
      const response = await axios.post("https://hazeyy-up-api.kyrinwu.repl.co/api/uptime", { uptime: url });

      if (response.data && response.data.success === false) {
        message.reply(response.data.msg);
        return;
      }
      global.api.unsendMessage(wait.messageID);
      message.reply(`🟢 | 𝖴𝖱𝖫 ${url} 𝗌𝗍𝖺𝗋𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!`);
    }, 8000);
  } catch (error) {
    message.reply("🔴 | 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖴𝗋𝗅 𝗆𝗈𝗇𝗂𝗍𝗈𝗋𝗂𝗇𝗀.");
    console.error(error);
  } finally {
    monitoredURLs.delete(url);
  }
};