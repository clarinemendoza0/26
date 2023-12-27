import axios from 'axios';

export default {
  config: {
    name: "ai2",
    version: "1.0",
    author: "Riley Nelson",//please don't change it
    countDown: 5,
    role: 0,
    description: "This command sends a question or query to AI and returns the answer." 
  },

  onCall: async function({ args, message }) {
    const prompt = args.join(" ");

    const typingIndicator = api.sendTypingIndicator;

    try {
      message.reply("Looking for answers... Please wait ");

      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `https://api--kurgtahu.repl.co/ai/${encodedPrompt}`;

      const { data } = await axios.get(apiUrl);

      typingIndicator();

      if (data.url) {
        const drawUrl = data.url;
        const stream = await global.utils.getStreamFromURL(drawUrl);
        message.reply({ body: "This is the picture you asked for", attachment: stream });
      } else if (data.reply) {
        const replyMessage = data.reply;
        message.reply({ body: replyMessage });
      }
    } catch (error) {
      console.error(error);
      typingIndicator();
      message.reply(`${error}`);
    }
  }
};