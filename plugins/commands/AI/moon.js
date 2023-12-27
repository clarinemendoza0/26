import axios from 'axios';

const config = {
  name: "moonwall",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rishad && Cyril Matt",
  description: "Generate moon image based on your information",
  usages: "moonwall name | day | month | year",
  cooldown: 5
};

async function onCall({ message, args })  {

  try {
    const input = args.join(" ").split(" | ");

    if (input.length !== 4) {
      return message.reply('Invalid format. Please use: moonwall name | day | month | year');
    }

    const [name, day, month, year] = input;

    const API = `https://for-devs.rishadapis.repl.co/api/moon?name=${encodeURIComponent(name)}&day=${encodeURIComponent(day)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&apikey=fuck`;

    const response = await axios.get(API, {
      responseType: 'stream',
      headers: {
        'Content-Type': 'image/png'
      }
    });

    const responseBody = `🌝Image Generated\n🔰Name: ${name}\n📆Day: ${day}\n🗓️Month: ${month}\n🎆Year: ${year}`;

    message.reply({
      body: responseBody,
      attachment: response.data,
    });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while processing the moonwall API');
  }
};

export default {
  config,
  onCall
}
