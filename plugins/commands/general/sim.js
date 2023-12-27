import axios from "axios";

const config = {
  name: 'sim',
  version: '1.2',
  hasPermission: 0,
  credits: 'KENLIEPLAYS converted by Ariél Violét',
  description: 'Simsimi ChatBot by Simsimi.fun',
  usages: '<word>',
  cooldowns: 15,
};

const langData = {
  en: {
    chatting: 'Already Chatting with sim...',
    error: 'Server Down Please Be Patient',
    missingInput: 'Please enter the content you want to chat with Sim',
  },
};

function onLoad() {
  if (!global.hasOwnProperty("sim")) global.sim = {};
}

async function onCall({ message, args, getLang, userPermissions }) {
  if (!message) {
    console.error("Missing required 'message' parameter. Check the function call.");
    return;
  }

  const input = args.join(" ");
  if (!input) {
    message.reply(getLang("missingInput"));
    return;
  }

  if (global.sim.hasOwnProperty(message.threadID)) {
    message.reply(getLang("chatting"));
    return;
  }

  try {
    const langCode = 'en';
    const responseMessage = await getMessage(input, langCode);
    message.reply(responseMessage);
  } catch (err) {
    message.reply(getLang("error"));
  }
}

async function getMessage(yourMessage, langCode) {
  try {
    const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=${langCode}&message=${yourMessage}&filter=true`);
    if (!res.data.success) {
      throw new Error('API returned a non-successful message');
    }
    return res.data.success;
  } catch (err) {
    console.error('Error while getting a message:', err);
    throw err;
  }
}

export default {
  config,
  onLoad,
  langData,
  onCall,
};