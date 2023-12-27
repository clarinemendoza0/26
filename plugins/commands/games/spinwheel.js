import axios from 'axios';

const spinwheelOptions = [
  { reward: '10000000 credits' },
  { reward: '400000000 credits' },
  { reward: '800000000 credits' },
  { reward: '1000000000 credits' },
  { reward: '1200000000 credits' },
  { reward: '3000000000 credits' },
  { reward: '10000000000000 JackPot! credits' },
];

const spinwheelCooldown = 10 * 60 * 1000; // 5 minutes cooldown

const config = {
  name: 'spinwheel',
  aliases: ['spinwheel'],
  description: 'Spin the wheel and win credits!',
  usage: '',
  cooldown: 10, // 1 minute cooldown
  credits: 'Ruru',
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function formatTimeLeft(timeLeft) {
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  return `${minutes} minutes`;
}


async function onCall({ message }) {
  const { senderID } = message;
  const { Users } = global.controllers;
  const userData = await Users.getData(senderID);

  const currentTime = Date.now();
  if (currentTime - userData.spinCooldown < spinwheelCooldown) {
    const remainingTime = spinwheelCooldown - (currentTime - userData.spinCooldown);
    const timeLeftMessage = `⏳ You must wait ${await formatTimeLeft(remainingTime)} before spinning again.`;
    return message.reply(timeLeftMessage);
  }

  try {
    const spinningMessage = '🎡 𝚂𝚙𝚒𝚗𝚗𝚒𝚗𝚐 𝚝𝚑𝚎 𝚠𝚑𝚎𝚎𝚕...';
    const spinningResponse = await message.reply(spinningMessage);

    await delay(2000);

    if (global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(spinningResponse.messageID);
    }

    const spunResult = spinwheelOptions[Math.floor(Math.random() * spinwheelOptions.length)];

    // Display a message with the winning reward
    const spinResultMessage = `🎉𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀 𝚈𝚘𝚞 𝚜𝚙𝚒𝚗 𝚝𝚑𝚎 𝚠𝚑𝚎𝚎𝚕 𝚊𝚗𝚍 𝚠𝚘𝚗: $${spunResult.reward}`;
    await message.reply(spinResultMessage);

    const rewardAmount = parseRewardAmount(spunResult.reward);
    await Users.increaseMoney(senderID, rewardAmount);

    userData.spinCooldown = currentTime;
    await Users.updateData(senderID, { spinCooldown: userData.spinCooldown });

    const nextSpinMessage = `Next spin available: ${await formatTimeLeft(spinwheelCooldown)}`;
    await message.reply(nextSpinMessage);
  } catch (error) {
    console.error('Error in spinwheel:', error);

    // Return the specific error message to the user
    return message.reply(`An error occurred while processing the spin: ${error.message}. Please try again later.`);
  }
}

function parseRewardAmount(reward) {
  return parseInt(reward.replace(/\D/g, ''), 10);
}

export default {
  config,
  onCall,
};
