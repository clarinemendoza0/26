import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "bird",
  aliases: ["feather"],
  description: "Collect feathers from your birds and sell them",
  usage: "<buy/check/collect/sell>",
  cooldown: 6,
  credits: 'Ariel V and Aiko (Modified from Rue)',
};

const langData = {
  "en_US": {
    "bird.buySuccess": "⌜🐦⌟ :\n— Congratulations, you've bought a bird named {birdName}!",
    "bird.buyFailure": "⌜🐦⌟:\n— You already have a bird.",
    "bird.checkInfo": "⌜🐦⌟:\n— 𝚈𝚘𝚞𝚛 𝚋𝚒𝚛𝚍 𝚗𝚊𝚖𝚎 𝚒𝚜 {birdName} 𝚒𝚗𝚏𝚘:\n━━━━━━━━━━\n𝗙𝗲𝗮𝘁𝗵𝗲𝗿𝘀 𝗖𝗼𝘂𝗻𝘁: {featherCount} 🪶\n𝗪𝗼𝗿𝘁𝗵: {collectedFeatherValue} 💰",
    "bird.collectSuccess": "⌜🐦⌟:\n— You collected {featherCount} feathers\nWorth {collectedValue} 💰",
    "bird.sellSuccess": "⌜💰⌟:\nYou sold {birdName} for ${amount}. Goodbye🐦",
    "bird.noBird": "⌜🤷🏻‍♂️⌟:\n— You don't have a bird. Use `bird buy` to get one."
  }
};

let birdOwners = new Map();
const FEATHER_INTERVAL = 1 * 60 * 1000;
const FEATHER_VALUE = 10000;
const BIRD_SELL_VALUE = 3000;  // Removed BIRD_COST
const PATH = join(global.assetsPath, 'bird_owners.json');

function loadBirdOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    birdOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load bird owners:', err);
  }
}

function saveBirdOwners() {
  try {
    const data = JSON.stringify([...birdOwners]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save bird owners:', err);
  }
}

function calculateCollectedFeatherValue(featherCount) {
  return featherCount * FEATHER_VALUE;
}

function updateFeatherGeneration() {
  const currentTime = Date.now();
  birdOwners.forEach((bird, ownerID) => {
    const elapsedTime = currentTime - bird.lastCollected;
    const featherCount = Math.floor(elapsedTime / FEATHER_INTERVAL);
    bird.featherCount += featherCount;
    bird.lastCollected = currentTime;
  });
}

loadBirdOwners();

async function onCall({ message, getLang, args }) {
  const featherCollecting = (await axios.get("https://i.imgur.com/ZOgYPVh.png", {
    responseType: "stream"
  })).data;
  const birdImage = (await axios.get("https://i.imgur.com/8vKNshs.jpg", {
    responseType: "stream"
  })).data;
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;
  const birdName = args[1]; // Bird name is the second argument

  async function decreaseMoney(ownerID, amount) {
    await Users.decreaseMoney(ownerID, amount);
  }

  updateFeatherGeneration();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "『🐦 Bird Feather Collecting Game』\n1. `bird buy <birdname>` » Buy a bird.\n2. `bird check` » Check your bird's info.\n3. `bird collect` » Collect feathers from your bird.\n4. `bird sell` » Sell your bird and earn money.",
      attachment: birdImage
    });
  }

  if (args[0] === "buy") {
    if (birdOwners.has(senderID)) {
      return message.reply(getLang("bird.buyFailure"));
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < BIRD_SELL_VALUE) {
      return message.reply("You don't have enough balance to buy a bird.");
    }

    birdOwners.set(senderID, {
      value: BIRD_SELL_VALUE,  // Removed BIRD_COST
      featherCount: 0,
      lastCollected: Date.now(),
      birdName: birdName
    });

    await decreaseMoney(senderID, BIRD_SELL_VALUE);  // Removed BIRD_COST
    saveBirdOwners();

    return message.reply(getLang("bird.buySuccess").replace("{birdName}", birdName));
  }

  if (args[0] === "check") {
    if (!birdOwners.has(senderID)) {
      return message.reply(getLang("bird.noBird"));
    }

    const birdData = birdOwners.get(senderID);
    const featherCount = birdData.featherCount;
    const collectedFeatherValue = calculateCollectedFeatherValue(featherCount);

    const checkMessage = getLang("bird.checkInfo")
      .replace("{birdName}", birdData.birdName)
      .replace("{featherCount}", featherCount)
      .replace("{collectedFeatherValue}", collectedFeatherValue);

    return message.reply(checkMessage);
  }

  if (args[0] === "collect") {
    if (!birdOwners.has(senderID)) {
      return message.reply(getLang("bird.noBird"));
    }

    const birdData = birdOwners.get(senderID);
    const featherCount = birdData.featherCount;

    if (featherCount === 0) {
      return message.reply("Your bird hasn't dropped any feathers yet.");
    }

    const collectedFeathers = featherCount * FEATHER_VALUE;
    const collectedValue = calculateCollectedFeatherValue(featherCount);

    birdData.featherCount = 0;
    saveBirdOwners();

    await Users.increaseMoney(senderID, collectedValue);

    return message.reply({
      body: getLang("bird.collectSuccess")
        .replace("{birdName}", birdData.birdName)
        .replace("{featherCount}", featherCount)
        .replace("{collectedValue}", collectedValue),
      attachment: featherCollecting
    });
  }

  if (args[0] === "sell") {
    if (!birdOwners.has(senderID)) {
      return message.reply(getLang("bird.noBird"));
    }

    const birdData = birdOwners.get(senderID);
    const birdValue = birdData.value;

    await Users.increaseMoney(senderID, BIRD_SELL_VALUE);  // Removed BIRD_COST
    birdOwners.delete(senderID);
    saveBirdOwners();

    return message.reply(getLang("bird.sellSuccess").replace("{amount}", BIRD_SELL_VALUE).replace("{birdName}", birdData.birdName));
  }

  return message.reply({
    body: "『 🐦 Bird Feather Collecting Game 』\n1. `bird buy <bird_name>` » Buy a bird.\n2. `bird check` » Check your bird's info.\n3. `bird collect` » Collect feathers from your bird.\n4. `bird sell` » Sell your bird and earn money.",
  });
}

export default {
  config,
  langData,
  onCall
};
