import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: 'plant',
  aliases: ['grow'],
  description: 'Buy and grow plants',
  usage: '<buy/check/sell/water/top>',
  cooldown: 5,
  credits: 'Ariél Violét, improved by Rue',
};

const langData = {
  en_US: {
    'plant.buySuccess': '⌜🌱⌟ :\n— 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀! 𝚢𝚘𝚞 𝚑𝚊𝚟𝚎 𝚙𝚕𝚊𝚗𝚝𝚎𝚍 𝚊 𝚗𝚎𝚠 𝚙𝚕𝚊𝚗𝚝 𝚜𝚎𝚎𝚍 𝘯𝘰𝘸 𝘸𝘢𝘪𝘵 𝘧𝘰𝘳 𝘪𝘵 𝘵𝘰 𝘨𝘳𝘰𝘸 𝘧𝘰𝘳 𝘢 𝘭𝘰𝘯𝘨 𝘵𝘪𝘮𝘦!',
    'plant.buyFailure': '⌜🌱⌟:\n— 𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚊 𝚙𝚕𝚊𝚗𝚝.',
    'plant.sellSuccess': '⌜💰⌟:\n— 𝚈𝚘𝚞 𝚜𝚘𝚕𝚍 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝 𝚏𝚘𝚛 ₱{amount} 💵',
    'plant.noPlant': '⌜🙅🏻‍♂️⌟:\n— You don\'t have a plant. Use `plant buy` to get one.',
    'plant.growthInfo': '⌜🌱⌟:\n— 𝗬𝗼𝘂𝗿 𝗽𝗹𝗮𝗻𝘁 𝗵𝗮𝘀 𝗴𝗿𝗼𝘄𝗻! 𝗜𝘁𝘀 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝘃𝗮𝗹𝘂𝗲 𝗶𝘀 ₱{value}.',
    'plant.checkInfo': '⌜🌱⌟:\n— 𝚈𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝 𝚟𝚊𝚕𝚞𝚎 𝚒𝚜: ${value}💰\n━━━━━━━━━━━━━━━\n𝙶𝚛𝚘𝚠𝚝𝚑 𝚟𝚊𝚕𝚞𝚎 𝚙𝚎𝚛 𝚌𝚢𝚌𝚕𝚎: +${growthValue}',
    'plant.waterCooldown': '⌜⏳⌟:\n— 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚠𝚊𝚒𝚝 {remainingCooldownMinutes} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜 𝚋𝚎𝚏𝚘𝚛𝚎 𝚠𝚊𝚝𝚎𝚛𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝 𝚊𝚐𝚊𝚒𝚗.',
  },
};

let waterCooldowns = new Map();
let plantOwners = new Map();
const GROWTH_INTERVAL = 20 * 60 * 1000; // Changed growth interval to 15 minutes
const GROWTH_PERCENTAGE = 0.01;
const WATER_COOLDOWN = 10 * 60 * 1000;
const PATH = join(global.assetsPath, 'plant.json');

function loadPlantOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    plantOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load plant owners:', err);
  }
}

function savePlantOwners() {
  try {
    const data = JSON.stringify(Array.from(plantOwners));
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save plant owners:', err);
  }
}

function updatePlantGrowth() {
  plantOwners.forEach(async (plant, ownerID) => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - plant.lastUpdated;
    const growthCycles = Math.floor(elapsedTime / GROWTH_INTERVAL);

    if (growthCycles > 0) {
      const newPlantValue = Math.floor(plant.value * Math.pow(1 + GROWTH_PERCENTAGE, growthCycles));
      plant.value = newPlantValue;
      plant.lastUpdated = currentTime;
      savePlantOwners();

      const user = await Users.getByID(ownerID); // Assuming Users.getByID is correctly implemented
      const growthMessage = getLang('plant.growthInfo').replace('{value}', newPlantValue);
      user.send(growthMessage);
    }
  });
}

// Replace the existing topPlantCommand function with this:
async function topPlantCommand({ message }) {
  const { Users } = global.controllers;

  const plantEntries = Array.from(plantOwners.entries());
  const sortedPlantOwners = plantEntries.sort((a, b) => b[1].value - a[1].value);

  let leaderboardMessage = '『𝗧𝗢𝗣 10 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝗣𝗟𝗔𝗡𝗧 𝗚𝗥𝗢𝗪𝗘𝗥𝗦』\n\n';
  for (let index = 0; index < Math.min(sortedPlantOwners.length, 10); index++) {
    const [ownerID, plantData] = sortedPlantOwners[index];
    const userName = await Users.getName(ownerID);

    // Format the currency as a plain number
    const formattedValue = plantData.value.toString();

    leaderboardMessage += `${index + 1}. ${userName}\n$${formattedValue} 💰━━━━━━━━━━━━━━━\n`;
  }

  message.reply({ body: leaderboardMessage });
}

// ...

async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  const plant = (await axios.get("https://i.imgur.com/mlecNfD.jpg", {
    responseType: "stream"
  })).data;
  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  updatePlantGrowth();

  if (args.length === 0 || args[0] === 'menu') {
    return message.reply({
      body:
        '◦❭❯❱【𝗣𝗟𝗔𝗡𝗧 𝐌𝐄𝐍𝐔】❰❮❬◦\n\n1. `𝚙𝚕𝚊𝚗𝚝 𝚋𝚞𝚢 <𝚊𝚖𝚘𝚞𝚗𝚝>` » 𝙱𝚞𝚢 𝚊 𝚙𝚕𝚊𝚗𝚝.\n𝟸. `𝚙𝚕𝚊𝚗𝚝 𝚌𝚑𝚎𝚌𝚔` » 𝙲𝚑𝚎𝚌𝚔 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝 𝚟𝚊𝚕𝚞𝚎.\n𝟹. `𝚙𝚕𝚊𝚗𝚝 𝚜𝚎𝚕𝚕` » 𝚂𝚎𝚕𝚕 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝.\n𝟺. `𝚙𝚕𝚊𝚗𝚝 𝚠𝚊𝚝𝚎𝚛` » 𝚆𝚊𝚝𝚎𝚛 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝.\n5. `𝚙𝚕𝚊𝚗𝚝 𝚝𝚘𝚙` » 𝚅𝚒𝚎𝚠 𝚝𝚘𝚙 𝚙𝚕𝚊𝚗𝚝 𝚘𝚠𝚗𝚎𝚛𝚜.',
      attachment: plant
    });
  }

  // Handle "buy" command
  if (args[0] === 'buy') {
    if (plantOwners.has(senderID)) {
      return message.reply(getLang('plant.buyFailure'));
    }

    const plantPrice = BigInt(args[1]);

    if (plantPrice <= 0) {
      return message.reply('Invalid amount. Please provide a valid amount of money to buy a plant.');
    }

    const userBalance = BigInt(await Users.getMoney(senderID));

    if (userBalance < plantPrice) {
      return message.reply("You don't have enough balance to buy a plant.");
    }

    // Confirm the purchase is successful before deducting the balance
    plantOwners.set(senderID, { name: message.senderName, value: Number(plantPrice), lastUpdated: Date.now() });
    savePlantOwners();

    await Users.decreaseMoney(senderID, plantPrice.toString()); // Deduct the balance here

    return message.reply(getLang('plant.buySuccess'));
}



  // Handle "check" command
  if (args[0] === 'check') {
    if (!plantOwners.has(senderID)) {
      return message.reply(getLang('plant.noPlant'));
    }

    const plantData = plantOwners.get(senderID);
    const plantValue = plantData.value;
    const growthValue = Math.floor(plantValue * GROWTH_PERCENTAGE);
    const checkMessage = getLang('plant.checkInfo')
      .replace('{value}', plantValue)
      .replace('{growthValue}', growthValue);
    return message.reply(checkMessage);
  }

  // Handle "sell" command
  if (args[0] === 'sell') {
    if (!plantOwners.has(senderID)) {
      return message.reply(getLang('plant.noPlant'));
    }

    const plantValue = plantOwners.get(senderID).value;
    await Users.increaseMoney(senderID, plantValue);
    plantOwners.delete(senderID);
    savePlantOwners();
    return message.reply(getLang('plant.sellSuccess').replace('{amount}', plantValue));
  }

  // Handle "water" command
  if (args[0] === 'water') {
    if (!plantOwners.has(senderID)) {
      return message.reply(getLang('plant.noPlant'));
    }

    const lastWateredTime = waterCooldowns.get(senderID);
    const currentTime = Date.now();

    if (lastWateredTime && currentTime - lastWateredTime < WATER_COOLDOWN) {
      const remainingCooldown = WATER_COOLDOWN - (currentTime - lastWateredTime);
      const remainingCooldownMinutes = Math.ceil(remainingCooldown / 60000);

      const cooldownMessage = getLang('plant.waterCooldown').replace('{remainingCooldownMinutes}', remainingCooldownMinutes);
      return message.reply(cooldownMessage);
    }

    const wateredGrowth = Math.floor(plantOwners.get(senderID).value * 0.01);
    plantOwners.get(senderID).value += wateredGrowth;
    waterCooldowns.set(senderID, currentTime);
    savePlantOwners();

    const waterMessage = '⌜🌱⌟ :\n— 𝚈𝚘𝚞 𝚠𝚊𝚝𝚎𝚛𝚎𝚍 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝, 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚗𝚘𝚠 𝚐𝚛𝚘𝚠 𝚏𝚊𝚜𝚝𝚎𝚛.';
    return message.reply(waterMessage);
  }

  // Handle "top plant" command
  if (args[0] === 'top') {
    return topPlantCommand({ message });
  }

  // ...
}

loadPlantOwners();

export default {
  config,
  langData,
  onCall,
};