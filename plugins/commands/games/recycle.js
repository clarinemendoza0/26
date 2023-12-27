import fetch from 'node-fetch';
import axios from 'axios';

const materials = [
  { name: 'Paper', coinValue: getRandomValue(20000, 40000), emoji: '📄' },
  { name: 'Plastic', coinValue: getRandomValue(15000, 30000), emoji: '🥤' },
  { name: 'Glass', coinValue: getRandomValue(18000, 35000), emoji: '🥛' },
  // Add more materials with different values and emojis
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "recycle",
  aliases: ["r", "dispose"],
  description: "Recycle materials and earn coins.",
  usage: "<text>",
  cooldown: 100,
  permissions: [0, 1, 2],
  credits: 'Aiko',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
  const recycleImage = await axios.get("https://i.imgur.com/w1HK2Gu.png", {
    responseType: "stream"
  });

  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let recycledData = [];

    for (let i = 0; i < 3; i++) {
      const randomMaterial = materials[Math.floor(Math.random() * materials.length)];

      const name = randomMaterial.name;
      const coin = randomMaterial.coinValue;
      const emoji = randomMaterial.emoji;

      totalAmount += coin;

      recycledData.push({
        name: ` ${emoji} ${name}:  ${coin.toLocaleString()} coins`,
      });
    }

    let replyMessage = `〘𝗬𝗼𝘂 𝗿𝗲𝗰𝘆𝗰𝗹𝗲𝗱 𝗺𝗮𝘁𝗲𝗿𝗶𝗮𝗹𝘀〙\n`;
    for (let i = 0; i < recycledData.length; i++) {
      replyMessage += `${recycledData[i].name}\n`;
    }

    replyMessage += `Total earned: ${totalAmount.toLocaleString()} coins 💰`;

    message.reply({
      body: replyMessage,
      attachment: recycleImage.data
    });

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('An error occurred while recycling materials!');
  }
}

export default {
  config,
  onCall,
};
