import axios from 'axios';

const badWords = ["gay", "pussy", "dick", "nude", "without", "clothes", "sugar", "fuck", "fucked", "step", "ðŸ¤­", "ðŸ¼", "shit", "bitch", "hentai", "ðŸ¥µ", "clothes", "sugar", "fuck", "fucked", "step", "?", "?", "shit", "bitch", "hentai", "?", "sex", "fuck", "boobs", "cute girl undressed", "undressed", "nude", "without clothes", "without cloth"];
// Bad Words And CMD BY Ohio03\\

const config = {
    name: 'draw',
    version: '1.0',
    credits: 'JARiF Ã— Ohio03 (Converted by Dymyrius)',
    description: 'Draw an image based on a prompt using Nax AI model.',
    usage: '[Your Prompt] | Model\nâ”€â”€ã€Ž Model ã€â”€â”€\n1. Anime_Meina-V9\n2. Anime_Orangemix\n3. Anime_Meinamix-V11'
};

async function onCall({ message, args }) {
    try {
      const info = args.join(' ');
      const [prompt, model] = info.split('|').map(item => item.trim());
      const text = args.join(" ");
      if (!text) {
        return message.reply(" ✖️ | Please Provide a Prompt\n───『 Models 』───\n1. Anime_Meina-V9\n2. Anime_Orangemix\n3. Anime_Meinamix-V11\nProper Usage:\n!draw Super dog | ");
      }

      if (containsBadWords(prompt)) {
        return message.reply('🔞 | NSFW Prompt Detected');
      }

      const apiKey = 'cat'; // API KEY BY JARiF\\

      const modelParam = model || '3'; // Default Model Is 3\\

      const apiUrl = `https://jarif-draw.gadhaame.repl.co/imagine?model=${modelParam}&prompt=${encodeURIComponent(prompt)}&apikey=${apiKey}`; // API BY JARiF\\

      await message.reply('Please Wait...⏳');

      const form = {
        body: "Here's Your Drawing 🎨¨",
      };

      form.attachment = [];
      form.attachment[0] = await global.getStream(apiUrl);

      message.reply(form);
    } catch (error) {
      console.error(error);
      await message.reply('⚜️ | Sorry, API Has Skill Issue');
    }
  };

function containsBadWords(prompt) {
  const promptLower = prompt.toLowerCase();
  return badWords.some(badWord => promptLower.includes(badWord));
}

export default {
  config,
  onCall
}