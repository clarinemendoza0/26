import axios from 'axios';

const config = {
  name: "codex",
  version: "1.0.0",
  credits: "August Quinn[Converted by: Rue]",
  description: "Generate code using Google.",
  usage: "[instruction]",
  cooldown: 5,
};

async function onCall({ message, args })  {
  const instruction = args.join(' ');

  if (!instruction) {
    message.reply("Please provide instructions to generate code.");
    return;
  }

  try {
    const response = await axios.post('http://codex.august-quinn-api.repl.co/code', { instruction });
    const result = response.data;

    if (result.google && result.google.status === "success") {
      message.reply(`⚙️ 𝗖𝗢𝗗𝗘𝗫'𝗦 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘\n\n\`\`\`${result.google.generated_text}\`\`\``);
    } else {
      message.reply("An error occurred while generating code.");
    }
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply("An error occurred while generating code.");
  }
};

export default (
  config,
  onCall
)