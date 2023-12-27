import axios from 'axios';

const config = {
  name: "palm",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes (Converted by: Rue)", //convert into mirai and Credits the api Samir Œ
  description: "asking questions with palm",
  usages: "[your question]",
  cooldown: 10,
};

async function onCall({  message , args }) {
  const question = args.join(" ");
  message.react("📝");

  if (!question) {
    return message.reply("Please Enter your Question");
  } else {
    try {
      const response = await axios.get(
        `https://google.odernder.repl.co/palm?text=hi${encodeURIComponent(question)}`
      );
      const answer = response.data.output; 
      message.react("📝");
      return message.reply(answer);
    } catch (error) {
      console.log(error);
      return message.reply("📫 | No output found in the response");
    }
  }
};

export default {
  config,
  onCall
}