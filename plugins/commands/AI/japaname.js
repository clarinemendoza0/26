import axios from 'axios';

const config = {
  name: 'japaname',
  version: '1',
  hasPermission: 0,
  credits: 'August Quinn (Converted by Rue)',
  description: 'Convert a name into Japanese',
  usages: '[name]',
  cooldown: 5,
};

async function onCall({  message , args }) {
  try {
    const name = args.join(' ');

    if (!name) {
      return message.reply('Please provide a name to convert.');
    }

    const apiUrl = `https://japanese-name-converter.august-api.repl.co/convertName?name=${encodeURIComponent(name)}`;
    const response = await axios.get(apiUrl);

    if (response.data.convertedName) {
      message.reply(`✅ "${name}" converted successfully:\n\n${response.data.convertedName}`);
    } else {
      message.reply('Error converting name. Please try again later.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    message.reply('Error converting name. Please try again later.');
  }
};

export default {
  config,
  onCall
}