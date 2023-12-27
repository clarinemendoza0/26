import fetch from 'node-fetch';
import axios from 'axios';

const vegetables = [
  { name: 'Tomato', coinValue: getRandomValue(30000, 50000), emoji: '🍅' },
  { name: 'Cherry', coinValue: getRandomValue(10000, 20000), emoji: '🍒' },
  { name: 'Pepper', coinValue: getRandomValue(20000, 40000), emoji: '🌶' },
  // Add more vegetables with different values and emojis
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "harvest",
  aliases: ["h", "gather"],
  description: "Harvest vegetables and earn coins.",
  usage: "<text>",
  cooldown: 100,
  permissions: [0, 1, 2],
  credits: 'Aiko',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
  const harvestImage = await axios.get("https://i.imgur.com/vIol4YW.png", {
    responseType: "stream"
  });

  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let harvestedData = [];

    for (let i = 0; i < 3; i++) {
      const randomVegetable = vegetables[Math.floor(Math.random() * vegetables.length)];

      const name = randomVegetable.name;
      const coin = randomVegetable.coinValue;
      const emoji = randomVegetable.emoji;

      totalAmount += coin;

      harvestedData.push({
        name: ` ${emoji} ${name}:  ${coin.toLocaleString()} coins`,
      });
    }

    let replyMessage = `〘𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗵𝗮𝗿𝘃𝗲𝘀𝘁𝗲𝗱 🗑〙\n`;
    for (let i = 0; i < harvestedData.length; i++) {
      replyMessage += `${harvestedData[i].name}\n`;
    }

    replyMessage += `Total earned: ${totalAmount.toLocaleString()} coins 💰`;

    message.reply({
      body: replyMessage,
      attachment: harvestImage.data
    });

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('An error occurred while harvesting!');
  }
}

export default {
  config,
  onCall,
};
