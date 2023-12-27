import axios from 'axios';

export default  {
  config: {
    name: "darkmeme",
    aliases: ["dmeme"],
    author: "kshitiz & Rickciel",
    version: "2.0",
    cooldown: 5,
    role: 0,
    description: "Get a dark meme, make sure you have a flashlight."  
  },
  
  onCall: async function({ message, args }) {
    try {
      const response = await axios.get('https://api31.chatbotmesss.repl.co/api/meme', {
        responseType: 'stream',
      });

      message.reply({
        body: "Here's a dark meme for you 💀",
        attachment: response.data,
      },);
    } catch (error) {
      console.error(error);
      message.reply("Error fetching memes.",);
    }
  }
};