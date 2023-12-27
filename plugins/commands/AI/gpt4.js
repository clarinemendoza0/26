import axios from 'axios';

const config = {
  name: "gpt4",
  version: "1.0.0",
  hasPermission: 0,
  credits: "JV Barcenas & cyril converted by Ariél Violét",
  description: "ChatGPT-4",
  usages: "<text>",
  cooldowns: 5,
};

async function onCall({ api, event, args, message }) {
  const { threadID, messageID } = message;
  const prompt = args.join(" ");

  try {
    await message.react("⏳");
    const response = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(prompt)}`);
    await message.react("✅");

    if (response.status === 200 && response.data && response.data.content) {
      const messageText = response.data.content.trim();
      global.api.sendMessage(messageText, threadID, messageID);
      console.log('Sent answer as a reply to the user');
    } else {
      throw new Error('Invalid or missing response from API');
    }
  } catch (error) {
    await message.react("❌");
    console.error(error);
    global.api.sendMessage(`${error.message}.\nAn error occurred fetching GPT API, please try again later.`, threadID, messageID);
  }
}

export default {
  config,
  onCall
}