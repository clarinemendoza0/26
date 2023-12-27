import axios from 'axios';

const config = {
  name: "aidetection",
  version: "1.0.0",
  credits: "August Quinn[Converted By: Ru]",
  description: "Detect AI-generated content powered by Originality AI.",
  usage: "[aidetection content]",
  cooldown: 5,
};

async function onCall({ message,args }) {
  const text = args.join(' ');

  if (!text) {
    message.reply("Please provide content for AI detection.");
    return;
  }

  try {
    const response = await axios.post('http://ai-content-detector.august-quinn-api.repl.co/result', { text });
    const result = response.data;

    let messages = `𝗔𝗜 𝗗𝗘𝗧𝗘𝗖𝗧𝗜𝗢𝗡 𝗦𝗖𝗢𝗥𝗘: ${result.originalityai.ai_score}\n\n`;

    if (result.originalityai.items && result.originalityai.items.length > 0) {
      result.originalityai.items.forEach((item) => {
        messages += `✅ 𝗖𝗔𝗡𝗗𝗜𝗗𝗔𝗧𝗘:\n\n- 𝗧𝗘𝗫𝗧: ${item.text}\n\n- 𝗣𝗥𝗘𝗗𝗜𝗖𝗧𝗜𝗢𝗡: ${item.prediction}\n- 𝗔𝗜 𝗦𝗖𝗢𝗥𝗘: ${item.ai_score}\n\n`;
      });

      message.reply(messages);
    } else {
      message.reply("No AI-generated content detected.");
    }
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply("An error occurred while detecting AI-generated content.");
  }
};

export default {
  config,
  onCall
}