const _24HOURs = 26400000;
import axios from 'axios'
const config = {
    name: "freegift",
    aliases: ["freegift","fg"],
    description: "Claim daily freegift",
    credits: "Rue",
    extra: {
      min: 1300000000,
      max: 13900000000
    }
}

const langData = {
    "en_US": {
        "freegift.selfNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
        "freegift.alreadyClaimed": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚛𝚎𝚌𝚒𝚎𝚟𝚎𝚍 𝚢𝚘𝚞𝚛 𝚏𝚛𝚎𝚎 𝚐𝚒𝚏𝚝 𝚝𝚘𝚍𝚊𝚢. 𝚈𝚘𝚞 𝚌𝚊𝚗 𝚛𝚎𝚌𝚒𝚎𝚟𝚎𝚍 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 {time}. ⏱️",
      "freegift.successfullyClaimed": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚊 𝚐𝚒𝚏𝚝 {giftName} 𝚠𝚘𝚛𝚝𝚑 ₱{amount} 🎁",
        "freegift.failed": "𝙵𝚊𝚒𝚕𝚎𝚍!"
    }
}

async function onCall({ message, extra, getLang }) {
    const { Users } = global.controllers;

    const giftNames = ["Cologne", "Watch", "Platinum", "Mystery Item"];

    const freegift = (await axios.get("https://i.imgur.com/qEvaJ60.jpg", {
        responseType: "stream"
    })).data;

    const { min, max } = extra;
    const userData = await Users.getData(message.senderID);
    if (!userData) return message.reply(getLang("freegift.selfNoData"));

    if (!userData.hasOwnProperty("freegift")) userData.freegift = 0;
    if (Date.now() - userData.freegift < _24HOURs) {
        return message.reply(getLang("freegift.alreadyClaimed", { time: global.msToHMS(_24HOURs - (Date.now() - userData.freegift)) }));
    }

    const amount = global.random(min, max);
    const randomGiftIndex = Math.floor(Math.random() * giftNames.length);
    const selectedGiftName = giftNames[randomGiftIndex];

    const result = await Users.updateData(message.senderID, { money: BigInt(userData.money || 0) + BigInt(amount), freegift: Date.now() });

    if (result) {
      message.reply({
          body: getLang("freegift.successfullyClaimed", { amount: global.addCommas(amount), giftName: selectedGiftName }),
          attachment: freegift
      });
    } else {
        message.reply(getLang("freegift.failed"));
    }
}

export default {
    config,
    langData,
    onCall
      }
