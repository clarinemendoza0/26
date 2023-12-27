import axios from 'axios';

const config = {
  name: 'grammarai',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn (Converted by Rue)',
  description: 'Your AI grammar expert for analysis and corrections.',
  cooldown: 5,
};

async function onCall({ message, args, }) {
  try {
    const prompt = args.join(' ');

    if (!prompt) {
      message.reply(
        'Hello! I am here to assist you with grammar analysis and corrections.',
      );
      return;
    }

    message.reply('Analyzing and crafting a response. Please wait....',);

    const response = await axios.post('https://grammarai.august-api.repl.co/textanalysis', { prompt });

    if (response.status === 200 && response.data && response.data.answer) {
      const messageText = response.data.answer.trim();
      message.reply(`💬 Grammar AI's Analysis and Correction:\n\n${messageText}`);
    } else {
      throw new Error('Invalid or missing response from Grammar AI API');
    }
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    message.reply(`Error: ${error.message}. An error occurred; please try again later.`);
  }
};

export default {
  config,
  onCall
}