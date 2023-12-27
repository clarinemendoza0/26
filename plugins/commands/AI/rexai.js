import axios from 'axios';

const config = {
  name: "rexai",
  version: "1.0.0",
  credits: "August Quinn (Converted by: Rue",
  description: "Rexai (Reseach-Expert-AI)",
  usages: "[prompt]",
  cooldown: 5,
};

async function onCall ({ message, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    return message.reply("Provide a title to proceed.");
  }
  message.react("🔍");

  try {
    const response = await axios.post('https://rexai-reseach-expert-ai.august-api.repl.co/response', { prompt });
    const responseData = response.data;

    message.react("☑️");
    message.reply(`${responseData.google.generated_text}`,);
  } catch (error) {
    console.error('ERROR', error.response?.data || error.message);
    message.reply('An error occurred while processing the command.',);
  }
};

export default {
  config,
  onCall
}