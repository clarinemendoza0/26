import axios from 'axios';

const config = {
  name: "plagia",
  version: "1.0.0",
  credits: "August Quinn[Converted by: Rue]",
  description: "Check for plagiarism powered by Winston AI.",
  usage: "[content]",
  cooldown: 5,
};

async function onCall({ message, args }) {
  const text = args.join(' ');

  if (!text) {
    message.reply("Please provide content to analyze for plagiarism.");
    return;
  }

  try {
    const response = await axios.post('http://plagiarism-detector.august-quinn-api.repl.co/result', { text });
    const result = response.data;

    let messages = `𝗣𝗟𝗔𝗚𝗜𝗔𝗥𝗜𝗦𝗠 𝗦𝗖𝗢𝗥𝗘: ${result.plagia_score}\n\n`;

    if (result.items && result.items.length > 0) {
      result.items.forEach((item, index) => {
        messages += `✅ 𝗖𝗔𝗡𝗗𝗜𝗗𝗔𝗧𝗘 ${index + 1}:\n\n- 𝗨𝗥𝗟: ${item.candidates[0].url}\n- 𝗣𝗟𝗔𝗚𝗜𝗔𝗥𝗜𝗦𝗠 𝗦𝗖𝗢𝗥𝗘: ${item.candidates[0].plagia_score}\n- 𝗣𝗥𝗘𝗗𝗜𝗖𝗧𝗜𝗢𝗡: ${item.candidates[0].prediction}\n\n`;
      });

      message.reply(messages);
    } else {
      message.reply("No plagiarism candidates found.");
    }
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply("An error occurred while checking for plagiarism.");
  }
};

export default {
  config,
  onCall 
}