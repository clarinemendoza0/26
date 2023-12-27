import axios from 'axios';

const config = {
  name: 'karma',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn(Converted By: Rue)',
  description: 'Get a karma quote.',
  usages: '',
  cooldown: 5,
};

async function onCall({ message }) {
  try {
    const response = await axios.get('https://karmaquotes.august-api.repl.co/quotes');
    const karmaQuotes = response.data;

    if (karmaQuotes.length === 0) {
      return message.reply('No karma quotes available, please try again later.',);
    }

    const randomIndex = Math.floor(Math.random() * karmaQuotes.length);
    const randomKarmaQuote = karmaQuotes[randomIndex];

    const messages = `💬 𝗞𝗔𝗥𝗠𝗔 𝗤𝗨𝗢𝗧𝗘:\n\n ➩ ${randomKarmaQuote.quote}`;

    message.reply(messages);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching karma quotes. Please try again later.');
  }
};

export default {
  config,
  onCall
}
