import axios from 'axios';

const config = {
  name: "historyv2",
  aliases: ["hv2"],
  version: "1.0",
  author: "kshitiz",
  credits: "Grim",
  cooldown: 10,
  description: "Send information about historical events.",
  usage: "[search_query]",
};

async function onCall({ args, message }) {
  const searchQuery = args.join(" ");

  if (!searchQuery) {
    message.reply(`Please provide a search query (${prefix}${config.name} anglo Nepal War).`);
    return;
  }

  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(apiUrl);

    if (response.data.title && response.data.extract) {
      const title = response.data.title;
      const extract = response.data.extract;

      message.reply(`Information about "${title}":\n${extract}`);
    } else {
      message.reply(`No information found for "${searchQuery}".`);
    }
  } catch (err) {
    console.error("Error fetching historical information:", err);
    message.reply("An error occurred while fetching historical information.");
  }
};

export default {
  config,
  onCall
};