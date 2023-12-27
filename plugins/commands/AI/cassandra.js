import axios from 'axios';

export default {
  config: {
    name: 'cassandra',
    version: '2.5',
    credits: 'JV Barcenas && LiANE For ChescaAI', // do not change
    role: 0,
    hasPermission: 2,
    description: 'Mystery?',
    usages: '[prompt]',
  },
  onCall: async function(context) {
    const { message , args } = context;

    try {
      const prompt = args.join(" ");
      if (prompt) {


        const response = await axios.get(`https://school-project-lianefca.bene-edu-ph.repl.co/` + `ask/cassandra?query=${encodeURIComponent(prompt)}`);

        if (response.data) {
          const messageText = response.data.message;
          await message.reply(messageText);

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
  },
};