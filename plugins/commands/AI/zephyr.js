import axios from 'axios';

const config = {
  name: "zephyr",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "KENLIEPLAYS",
  description: "GPTGO by KENLIEPLAYS",
  usage: "[ask]",
  cooldown: 2,
};

async function onCall({ message, args }) {
  let { messageID, threadID, } = message;
  let tid = threadID,
    mid = messageID;
  const content = encodeURIComponent(args.join(" "));
  if (!args[0]) return api.sendMessage("Please type a message...", tid, mid);
  try {
    const res = await axios.get(`https://ai.easy-api.repl.co/api/zephyr?query=${content}`);
    const respond = res.data.content;
    if (res.data.error) {
      api.sendMessage(`Error: ${res.data.error}`, tid, (error) => {
        if (error) {
          console.error(error);
        }
      }, mid);
    } else {
      api.sendMessage(respond, tid, (error) => {
        if (error) {
          console.error(error);
        }
      }, mid);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching the data.", tid, mid);
  }
};

export default {
  config,
  onCall
}