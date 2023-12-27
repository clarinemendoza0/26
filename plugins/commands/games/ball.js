import crypto from "crypto";

const config = {
  name: "shoot",
  aliases: ["ballshoot", "ballshot"],
  description: "Shoot a ball and try your luck to win or lose.",
  usage: "[bet]",
  credits: "Ruru Hussain",
  cooldown: 10,
  extra: {
    minbet: 100, // The minimum bet amount
  },
};

const langData = {
  "en_US": {
    "ballshoot.not_enough_money": "You don't have enough money to place this bet.",
    "ballshoot.min_bet": "𝘛𝘩𝘦 𝘮𝘪𝘯𝘪𝘮𝘶𝘮 𝘣𝘦𝘵 𝘢𝘮𝘰𝘶𝘵 𝘪𝘴 ${minBet}. 💵",
    "ballshoot.result_win": "𝗬𝗼𝘂 𝘀𝗵𝗼𝘁 𝘁𝗵𝗲 ⛹️ 𝗶𝗻𝘁𝗼 𝘁𝗵𝗲 𝗵𝗼𝗼𝗽\n━━━━━━━━━━━━━━━\n𝗮𝗻𝗱 𝘄𝗼𝗻 \n${bet}! 💵",
    "ballshoot.result_lose": "𝗬𝗼𝘂 𝗺𝗶𝘀𝘀𝗲𝗱 𝘁𝗵𝗲 𝘀𝗵𝗼𝘁 \n━━━━━━━━━━━━━━━\n𝗮𝗻𝗱 𝗹𝗼𝘀𝘁! ${bet}. 💵",
    "any.error": "An error occurred, please try again."
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;

  const bet = BigInt(args[0] || extra.minbet);

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("ballshoot.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("ballshoot.min_bet", { minBet: extra.minbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate a cryptographically secure random number in the range [0, 1)
    const randomValue = crypto.randomInt(2); // 0 or 1

    if (randomValue === 0) {
      const winnings = bet * BigInt(2);
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("ballshoot.result_win", { bet: winnings }));
    } else {
      return message.reply(getLang("ballshoot.result_lose", { bet }));
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
