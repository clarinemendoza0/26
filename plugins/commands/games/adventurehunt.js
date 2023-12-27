import { join } from 'path';
import axios from 'axios';

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const treasureChance = 0.75; 
const treasureMinValue = 5000000;
const treasureMaxValue = 75000000;
const treasureGifURL = 'https://media.tenor.com/n3U5sOXhfgYAAAAM/kingofboys-kingofboysmovie.gif';
const treasureCooldown = 2.5 * 60 * 60 * 1000; 

const config = {
  name: 'adventurehunt',
  aliases: ['adventure', 'ah'],
  description: 'Embark on an epic adventure to discover hidden treasures!',
  usage: '#adventurehunt',
  cooldown: 20,  
  credits: 'Your Name'
};

const langData = {
  en_US: {
    'adventurehunt.hunt': '🌟 Setting off on an epic adventure to find hidden treasures...',
    'adventurehunt.success': 'Congratulations! You discovered a adventure chest 💰💎🗝️ worth ${amount}!',
    'adventurehunt.failure': 'You searched but didn\'t find any treasure this time... Try again in 3 minutes.',
    'adventurehunt.cooldown': '⏳You must wait until your next adventure in {hours} hours and {minutes} minutes.'
  }
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onCall({ message, getLang }) {
  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  const { Users } = global.controllers;
  const userData = await Users.getData(senderID);

  if (!userData.hasOwnProperty('treasureCooldown')) {
    userData.treasureCooldown = 0;
  }

  const currentTime = Date.now();
  if (currentTime - userData.treasureCooldown < treasureCooldown) {
    const remainingTime = treasureCooldown - (currentTime - userData.treasureCooldown);
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
    const cooldownMessage = getLang('adventurehunt.cooldown').replace('{hours}', hours).replace('{minutes}', minutes);
    return message.reply(cooldownMessage);
  }

  const huntingMessage = getLang('adventurehunt.hunt');
  const gifResponse = await axios.get(treasureGifURL, { responseType: 'stream' });

  const searching = await message.reply({
    body: huntingMessage,
    attachment: gifResponse.data 
  });

  await delay(8000);  // Adjusted delay time for a more suspenseful experience

  if (global.api && global.api.unsendMessage) {
    await global.api.unsendMessage(searching.messageID);
  }

  if (Math.random() <= treasureChance) {
    const treasureAmount = getRandomValue(treasureMinValue, treasureMaxValue);

    const treasureMessage = getLang('adventurehunt.success').replace('{amount}', treasureAmount);
    const treasureImage = 'https://i.pinimg.com/564x/33/0c/9f/330c9f69271d5a8dc7ce3881cb61edd6.jpg';

    const imageResponse = await axios.get(treasureImage, {
      responseType: 'stream',
    });

    await message.reply({
      body: treasureMessage,
      attachment: imageResponse.data,
    });

    await Users.increaseMoney(senderID, treasureAmount);

    userData.treasureCooldown = currentTime;
    await Users.updateData(senderID, { treasureCooldown: userData.treasureCooldown });
  } else {
    const failureMessage = getLang('adventurehunt.failure');
    await message.reply(failureMessage);
  }
}

export default {
  config,
  langData,
  onCall
};
