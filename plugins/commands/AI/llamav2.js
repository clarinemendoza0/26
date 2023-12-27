import axios from 'axios';

const config = {
  name: "llama2",
  version: "1.0.0",
  hasPermission: 0,
  credits: "",
  description: "Chat with llama2",
  usages: "<text>",
  cooldowns: 3,
};

async function onCall({ api, event, args, message }) {
  const { threadID, messageID } = message;
  const query= args.join(" ");
  try {
    await message.react("⏳");
    const response = await axios.post(`https://api.kenliejugarap.com/Llama2/?text=${query}`);
    await message.react("✅");
    global.api.sendMessage(response.data.response, threadID, messageID);
  } catch (error) {
    await message.react("❌")
    console.error(error);
    global.api.sendMessage('Catgpt didn\'t meow back.', threadID, messageID);
  }
};

export default {
  config,
  onCall
}