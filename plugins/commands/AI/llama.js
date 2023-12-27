import axios from 'axios';

  const config = {
  name: "llama",
  version: "1.0.0",
  credits: "August Quinn (Converted by rue)",
  description: "Get a llama response.",
  usages: "[prompt]",
  cooldown: 5,
};

async function onCall({ message, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    return message.reply("Please provide a prompt for the llama.");
  }

  try {
    await message.react("⏳");
    const response = await axios.get(`https://llama.august-api.repl.co/llama?prompt=${encodeURI(prompt)}`);
    const llamaResponse = response.data.response;
    await message.react("✅");

    const messages = {
      body: `🦙 𝗟𝗟𝗔𝗠𝗔 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘:\n\n${llamaResponse}`,
    };

    message.reply(messages);
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply('An error occurred while processing the command.');
  }
};

export default {
  config,
  onCall
}
