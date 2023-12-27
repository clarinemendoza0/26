import axios from 'axios';

const config = {
  name: "autocorrect",
  version: "2.0.5",
  hasPermssion: 0,
  credits: "NIGGARONALD",
  description: "Bumubuhat ng apat, dumudurog ng lima, Wala kang papa",
  cooldown: 5,
};

async function onCall({ message, args }) {
  let { messageID, threadID, } = message
  let tid = threadID,
    mid = messageID;
  const content = encodeURIComponent(args.join(" "));

  const nigga = `Correct%20the%20spelling%20and%20the%20sentence%20of%20this%20message\n%20${content}`
  if (!args[0]) return api.sendMessage("ANO ICOCORRECT KO NIGGA?", tid, mid);
  try {
    const res = await axios.get(`https://api.easy0.repl.co/api/blackbox?query=${nigga}`);
    const respond = res.data.response;
    if (res.data.error) {
      message.reply(`TANGA ETO ERROR: ${res.data.error}`, tid, (error) => {
        if (error) {
          console.error(error);
        }
      }, mid);
    } else {
      message.reply(respond, tid, (error) => {
        if (error) {
          console.error(error);
        }
      }, mid);
    }
  } catch (error) {
    console.error(error);
    message.reply("NIGGA AYAW GUMANA NG API", tid, mid);
  }
};

export default {
  config,
  onCall
}