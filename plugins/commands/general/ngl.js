import axios from 'axios';

const config = {
  name: 'ngl',
  version: '1.0.0',
  credits: 'Kim Joseph DG Bien (Converted by Dymyrius)',
  description: 'Send a spam ngl message.',
  usage: '[username] [message] [amount]',
};

async function onCall({ api, message, args, prefix }) {
  const { threadID, messageID } = message;
  const nglusername = args[0];
  const messages = args.slice(1, -1).join(' ');
  const amount = args[args.length - 1];

  const maxAmount = 10; // Set the maximum number of messages to 10

  if (!nglusername || !messages || !amount || amount > maxAmount) {
    return global.api.sendMessage(
      `Invalid command format. Format: ${prefix}[username] [message] [1-${maxAmount}]`,
      threadID, messageID
    );
  }

  try {
    const headers = {
      referer: `https://ngl.link/${nglusername}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    const data = {
      username: nglusername,
      question: messages,
      deviceId: 'ea356443-ab18-4a49-b590-bd8f96b994ee',
      gameSlug: '',
      referrer: '',
    };

    let value = 0;
    for (let i = 0; i < amount; i++) {
      await axios.post('https://ngl.link/api/submit', data, {
        headers,
      });
      value += 1;
      console.log(`[+] Send => ${value}`);
    }

    global.api.sendMessage(
      `Successfully sent ${amount} message(s) to ${nglusername} through ngl.link.`,
      threadID, messageID
    );
  } catch (error) {
    console.error(error);
    global.api.sendMessage(
      'An error occurred while sending the message through ngl.link.',
      threadID, messageID
    );
  }
};

export default {
  config,
  onCall,
};