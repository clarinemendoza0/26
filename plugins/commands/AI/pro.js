import axios from 'axios';

const config = {
  name: 'professor',
  version: '3.0',
  credits: 'Api by JV Barcenas && Cyril Matt', // do not change // Fix command for Mirai/Botpack users 
  hasPermission: 0,
  description: 'Professor Ai, willing to teach you as he can.',
  usages: '[prompt]',
  cooldown: 4
};

async function onCall(context) {
  const { message } = context;

  try {
    const prompt = message.body.trim();
    if (prompt) {
      const loadingMessage = await message.reply("💭 | Professor AI is thinking, please wait a moment...");
      message.react("💀");

      const response = await axios.get(`https://gptproffessor.miraixyxy.repl.co/professor?prompt=${encodeURIComponent(prompt)}`);

      if (response.data) {
        const messageText = `🧑‍🏫Professor: 

        ${response.data.content}`;
        const answer = await message.reply(messageText);
        message.react("☁️");
        message.react("🧑‍🏫");

        console.log('Sent answer as a reply to the user');
      } else {
        throw new Error('Invalid or missing response from API');
      }
    }
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    message.reply(
      `${error.message}.\n\nYou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
    );
  }
};

export default {
  config,
  onCall
}
