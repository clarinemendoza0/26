import axios from 'axios';

const config = {
  name: 'programmingjoke',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'August Quinn(Converted By: Rue)',
  description: 'Get a random programming joke.',
  usages: '',
  cooldown: 5,
};

async function onCall({ message }) {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random');
    const joke = response.data[0];

    message.reply(`💻 𝗣𝗥𝗢𝗚𝗥𝗔𝗠𝗠𝗜𝗡𝗚 𝗝𝗢𝗞𝗘:\n\n${joke.setup}\n${joke.punchline}`,);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching a programming joke.',);
  }
};

export default {
  config,
  onCall
}
