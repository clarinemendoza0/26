import axios from 'axios';

const config = {
  name: 'kasabihan',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'August Quinn (Converted By; Rue',
  description: 'Get a random Tagalog quote.',
  usages: '',
  cooldown: 5,
};

async function onCall({ message }) {
  try {
    const englishQuoteAPI = 'https://api.quotable.io/random?language=en';

    const quote = await axios.get(englishQuoteAPI);

    const quoteText = quote.data.content;

    const translationAPI = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tl&dt=t&q=' + encodeURIComponent(quoteText);
    const translationResponse = await axios.get(translationAPI);

    const tagalogQuote = translationResponse.data[0][0][0];

    const author = quote.data.author;

    const messages = `💬 𝗞𝗔𝗦𝗔𝗕𝗜𝗛𝗔𝗡\n\n"${tagalogQuote}" - ${author || 'Unknown'}`;
    message.reply(messages);
  } catch (error) {
    console.error('Error fetching Tagalog quote:', error);
    message.reply('Error fetching Tagalog quote. Please try again.');
  }
};

export default {
  config,
  onCall
}
