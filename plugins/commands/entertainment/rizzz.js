import axios from 'axios';

export default {
  config: {
    name: 'rizz',
    version: '2.0.1',
    credits: 'Grim',
    cooldown: 8,
    description: 'Tells a random rizz line fetched from a rizz line API.'
  },
  onCall: async function({ message }) {
    const rizz = (await axios.get("https://i.imgur.com/AvhZSO7.gif", {
      responseType: "stream"
    })).data;
    try {
      const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

      if (response.status !== 200 || !response.data || !response.data.pickup) {
        throw new Error('Invalid or missing response from pickup line API');
      }

      const pickupline = response.data.pickup;

      await message.reply({
        body: `😎: ${pickupline}`,
        attachment: rizz
      });
    } catch (error) {
      console.error(`Failed to send pickup line : ${error.message}`);
      message.reply('Sorry, something went wrong while trying to tell a rizz line. Please try again later.');
    }
  }
};