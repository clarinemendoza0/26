import { join } from 'path';
import axios from 'axios';

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const treasureChance = 0.8; 
const treasureMinValue = 10000000;
const treasureMaxValue = 100000000;
const treasureGifURL = 'https://media.tenor.com/n3U5sOXhfgYAAAAM/kingofboys-kingofboysmovie.gif';
const treasureCooldown = 3 * 60 * 60 * 1000; 

const config = {
  name: 'treasurehunt',
  aliases: ['treasure', 'th'],
  description: 'Go on a treasure hunt and try to find money in hidden treasures!',
  usage: '#treasurehunt',
  cooldown: 120,  
  credits: 'Ariél Violét'
};

const langData = {
  en_US: {
    'treasurehunt.hunt': '🕵️‍♂️𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚏𝚘𝚛 𝚑𝚒𝚍𝚍𝚎𝚗 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎...',
    'treasurehunt.success': '𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐬! 𝚈𝚘𝚞 𝚏𝚘𝚞𝚗𝚍 𝚊 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎 𝚌𝚑𝚎𝚜𝚝💰💍👑𝚠𝚘𝚛𝚝𝚑 ${amount}!',
    'treasurehunt.failure': '𝚈𝚘𝚞 𝚜𝚎𝚊𝚛𝚌𝚑𝚎𝚍 𝚋𝚞𝚝 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚏𝚒𝚗𝚍 𝚊𝚗𝚢 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎 𝚝𝚑𝚒𝚜 𝚝𝚒𝚖𝚎.. 𝚝𝚊𝚔𝚎 𝚊 𝚛𝚎𝚜𝚝 𝚏𝚘𝚛 𝟸 𝚖𝚒𝚗𝚜. 𝚊𝚗𝚍 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.',
    'treasurehunt.cooldown': '⏳𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚠𝚊𝚒𝚝 𝚞𝚗𝚝𝚒𝚕 𝚢𝚘𝚞𝚛 𝚗𝚎𝚡𝚝 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎 𝚑𝚞𝚗𝚝. 𝙽𝚎𝚡𝚝 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚒𝚗 {hours} 𝚑𝚘𝚞𝚛𝚜 𝚊𝚗𝚍 {minutes} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜.'
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
    const cooldownMessage = getLang('treasurehunt.cooldown').replace('{hours}', hours).replace('{minutes}', minutes);
    return message.reply(cooldownMessage);
  }

  const huntingMessage = getLang('treasurehunt.hunt');
  const gifResponse = await axios.get(treasureGifURL, { responseType: 'stream' });

  const searching = await message.reply({
    body: huntingMessage,
    attachment: gifResponse.data 
  });

  await delay(7000);

  if (global.api && global.api.unsendMessage) {
    await global.api.unsendMessage(searching.messageID);
  }

  if (Math.random() <= treasureChance) {
    const treasureAmount = getRandomValue(treasureMinValue, treasureMaxValue);

    const treasureMessage = getLang('treasurehunt.success').replace('{amount}', treasureAmount);
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
    const failureMessage = getLang('treasurehunt.failure');
    await message.reply(failureMessage);
  }
}

export default {
  config,
  langData,
  onCall
};