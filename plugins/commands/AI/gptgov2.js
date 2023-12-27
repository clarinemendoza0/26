import axios from 'axios';

const masterID = "100091060972647";

const config = {
  name: "gptgov2",
  version: "1.1",
  hasPermission: 0,
  credits: "August Quinn[Converted By:Ruru]",
  description: "Interact with GPTGO API",
  usages: "[query]",
  cooldown: 3,
};

async function onCall({ message, args }) {
  const getUserInfo = async (api, userID) => {
    try {
      const name = await api.getUserInfo(userID);
      return name[userID].firstName;
    } catch (error) {
      console.error(`${error}`);
    }
  };

  let { senderID } = message
  const query = args.join("");

  if (!query) {
    const name = await getUserInfo(api, senderID);
    const isMaster = senderID === masterID;
    const assistanceMessage = isMaster ? "How may I assist you?" : "How can I help?";

    message.reply({
      body: `👋 Hey ${name}. ${assistanceMessage}`,
      mentions: [{ tag: name, id: senderID }]
    });
    return;
  }
  message.react("🔍");

  const name = await getUserInfo(api, senderID);

  try {
    const isMaster = senderID === masterID;
    const apiResponse = await axios.get(`https://gptgo.august-quinn-api.repl.co/api?uid=${senderID}&query=${encodeURIComponent(query)}`);
    const result = apiResponse.data.answer;

    const finalResponse = isMaster ? `👋 Master ${name}! ${result}` : `👋 ${name}, ${result}`;
    message.react("☑️");
    message.reply({
      body: finalResponse,
      mentions: [{ tag: name, id: senderID }]
    });
  } catch (error) {
    message.reply("⛔ High Traffic: Please try again later.");
  }
};

export default {
  config,
  onCall
}