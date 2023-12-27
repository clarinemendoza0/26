import axios from 'axios';

const config = {
  name: "replit-ai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes[Converted By: Ruru]",// credits the api by hazeyy
  description: "Get response from Replit AI",
  usages: "[your question]",
  cooldown: 10,
};

async function onCall({ message, args }) {
  if (!args[0]) return message.reply("Please Input Your Question");
  const question = encodeURIComponent(args.join(" "));
  const apiUrl = `https://hazeyy-api-useless.kyrinwu.repl.co/api/replit/ai?input=${question}`;

  try {
    message.reply("⏱️ | Replit AI is Typing Just Please wait...");
    const response = await axios.get(apiUrl);
    if (response.data && response.data.bot_response && response.data.bot_response.trim() !== "") {
      message.reply(response.data.bot_response);
    } else {
      message.reply("Replit AI did not provide a valid response.",);
    }
  } catch (error) {
    message.reply("Sorry, I can't get a response from Replit AI at the moment.");
    console.error(error);
  }
};

export default {
  config,
  onCall
}