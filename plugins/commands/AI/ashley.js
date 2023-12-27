import axios from 'axios';

export const config = {
  name: 'ashley',
  version: '1.0',
  hasPermission: 0,
  credits: 'Aliester Crowley',
  description: 'Interact with the cai for chat responses.',
  usePrefix: true,
  commandCategory: 'AI',
  usages: 'ashley {message}',
  cooldowns: 0,
};

export async function onCall({ message }) {
  const { senderID, body } = message;
  const getUserInfo = async (api, userID) => {
    try {
      const userInfo = await global.api.getUserInfo(userID);
      return userInfo[userID].firstName;
    } catch (error) {
      console.error(`Error fetching user info: ${error}`);
      return '';
    }
  };

  try {
    const name = await getUserInfo(api, senderID);
    let messages = body;

    if (message.messageReply) {
      messages = `${name}: Regarding your message "${message.messageReply.body}", ${message}`;
    }

    if (!messages) {
      return message.reply('Please provide a message/question.\\Usage: ashley {message}');
    }

    const API_ENDPOINT = `https://cai.aliestercrowleymv.repl.co/api?char=zG7RNkQutpO9-uo8Q0A7CQKt_BHiDsJGBVu7Y3gmZGc&prompt=${name} to you: ${encodeURIComponent(message)}`;

    const response = await axios.get(API_ENDPOINT);

    if (response.data && response.data.text) {
      let caiResponse = response.data.text;
      caiResponse = caiResponse.replace(/Character\AI/g, 'CrowAI');
      caiResponse = caiResponse.replace(/www.character.ai/g, 'aliestercrowley.com');

      caiResponse = `${caiResponse}`;

      message.reply({ body: caiResponse, attachment: null });
    } else {
      message.reply('❌ | An error occurred. Please try again later.');
    }
  } catch (error) {
    console.error(error);
    message.reply('❌ | An error occurred. Please try again later.');
  }
};