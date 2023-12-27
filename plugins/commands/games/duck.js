import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "duck",
  aliases: ["egg"],
  description: "Buy ducks, collect eggs, and sell your ducks",
  usage: "<buy/check/collect/sell>",
  cooldown: 6,
  credits: 'Ariél Violét (Modified by Rue)',
};

const langData = {
  "en_US": {
    "duck.buySuccess": "⌜🦆⌟ :\n— Congratulations, you've bought a duck name {duckName}!",
    "duck.buyFailure": ":⌜🦆⌟:\n—  You already have a duck ",
    "duck.checkInfo": "⌜🦆⌟:\n—  𝚈𝚘𝚞𝚛 𝚍𝚞𝚌𝚔 𝚗𝚊𝚖𝚎 𝚒𝚜 {duckName} 𝚒𝚗𝚏𝚘:\n━━━━━━━━━━\n𝗘𝗴𝗴𝘀 𝗖𝗼𝘂𝗻𝘁: {eggCount} 🥚\n𝗪𝗼𝗿𝘁𝗵: {collectedEggValue} 💰",
    "duck.collectSuccess": "⌜🦆⌟: \n—You collected {eggCount} eggs\nWorth {collectedValue} 💰",
    "duck.sellSuccess": "⌜💰⌟: \nYou sold {duckName} for ${amount}. Goodbye🦆",
    "duck.noDuck": "⌜🤷🏻‍♂️⌟:\n— You don't have a duck. Use `duck buy `to get one."
  }
};

let duckOwners = new Map();
const EGG_INTERVAL = 1 * 60 * 1000;
const EGG_VALUE = 12345670;
const DUCK_COST = 10000000;
const DUCK_SELL_VALUE = 7500000;
const PATH = join(global.assetsPath, 'duck_owners.json');

function loadDuckOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    duckOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load duck owners:', err);
  }
}

function saveDuckOwners() {
  try {
    const data = JSON.stringify([...duckOwners]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save duck owners:', err);
  }
}

function calculateCollectedEggValue(eggCount) {
  return eggCount * EGG_VALUE;
}

function updateEggGeneration() {
  const currentTime = Date.now();
  duckOwners.forEach((duck, ownerID) => {
    const elapsedTime = currentTime - duck.lastCollected;
    const eggCount = Math.floor(elapsedTime / EGG_INTERVAL);
    duck.eggCount += eggCount;
    duck.lastCollected = currentTime;
  });
}

loadDuckOwners();

async function onCall({ message, getLang, args }) {
  const eggCollecting = (await axios.get("https://i.imgur.com/ZOgYPVh.png", {
    responseType: "stream"
  })).data;
  const duckImage = (await axios.get("https://i.imgur.com/PtX1FiL.jpg", {
    responseType: "stream"
  })).data;
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;
  const duckName = args[1]; // Duck name is the second argument

  async function decreaseMoney(ownerID, amount) {
    await Users.decreaseMoney(ownerID, amount);
  }

  updateEggGeneration();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "『🦆 Duck Egg Farming Game』\n1. `duck buy <duckname>` » Buy a duck.\n2. `duck check` » Check your duck's info.\n3. `duck collect` » Collect eggs from your duck.\n4. `duck sell` » Sell your duck and earn money.",
      attachment: duckImage
    });
  }

  if (args[0] === "buy") {
    if (duckOwners.has(senderID)) {
      return message.reply(getLang("duck.buyFailure").replace("{duckName}", duckName));
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < DUCK_COST) {
      return message.reply("You don't have enough balance to buy a duck.");
    }

    duckOwners.set(senderID, {
      value: DUCK_COST,
      eggCount: 0,
      lastCollected: Date.now(),
      duckName: duckName
    });

    await decreaseMoney(senderID, DUCK_COST);
    saveDuckOwners();

    return message.reply(getLang("duck.buySuccess").replace("{duckName}", duckName));
  }

  if (args[0] === "check") {
    if (!duckOwners.has(senderID)) {
      return message.reply(getLang("duck.noDuck"));
    }

    const duckData = duckOwners.get(senderID);
    const eggCount = duckData.eggCount;
    const collectedEggValue = calculateCollectedEggValue(eggCount);

    const checkMessage = getLang("duck.checkInfo")
      .replace("{duckName}", duckData.duckName)
      .replace("{eggCount}", eggCount)
      .replace("{collectedEggValue}", collectedEggValue);

    return message.reply(checkMessage);
  }

  if (args[0] === "collect") {
    if (!duckOwners.has(senderID)) {
      return message.reply(getLang("duck.noDuck"));
    }

    const duckData = duckOwners.get(senderID);
    const eggCount = duckData.eggCount;

    if (eggCount === 0) {
      return message.reply("Your duck hasn't laid any eggs yet.");
    }

    const collectedEggs = eggCount * EGG_VALUE;
    const collectedValue = calculateCollectedEggValue(eggCount);

    duckData.eggCount = 0;
    saveDuckOwners();

    await Users.increaseMoney(senderID, collectedValue);

    return message.reply({
      body: getLang("duck.collectSuccess")
        .replace("{duckName}", duckData.duckName)
        .replace("{eggCount}", eggCount)
        .replace("{collectedValue}", collectedValue),
      attachment: eggCollecting
    });
  }

  if (args[0] === "sell") {
    if (!duckOwners.has(senderID)) {
      return message.reply(getLang("duck.noDuck"));
    }

    const duckData = duckOwners.get(senderID);
    const duckValue = duckData.value;

    await Users.increaseMoney(senderID, DUCK_SELL_VALUE);
    duckOwners.delete(senderID);
    saveDuckOwners();

    return message.reply(getLang("duck.sellSuccess").replace("{amount}", DUCK_SELL_VALUE).replace("{duckName}", duckData.duckName));
  }

  return message.reply({
    body: "『 🦆 Duck Egg Farming Game 』\n1. `duck buy <duck_name>` » Buy a duck.\n2. `duck check` » Check your duck's info.\n3. `duck collect` » Collect eggs from your duck.\n4. `duck sell` » Sell your duck and earn money.",
  });
}

export default {
  config,
  langData,
  onCall
};
