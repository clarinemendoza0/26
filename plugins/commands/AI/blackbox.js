import axios from 'axios';

export const config= {
    name: "blackbox",
    version: "1.0.0",
    credits: "Who's Deku? (Converted by Grim)",
    description: "AI powered by Blackbox",
    usage: "[ask]",
    cooldown: 5
};

export async function onCall({ message, args }) {
    const q = encodeURIComponent(args.join(" "));
    if (!q) return message.reply("[❗] - Missing input");
    try {
        message.react("🔍");

        const url = 'https://useblackbox.io/chat-request-v4';

  const data = {
    textInput: q,
    allMessages: [{ user: q }],
    stream: '',
    clickedContinue: false,
  };

const res = await axios.post(url, data);

    const m = res.data.response[0][0];
      message.react("☑️");
return message.reply(m)
   } catch(e){
  return message.reply(e.message)
    }
  };