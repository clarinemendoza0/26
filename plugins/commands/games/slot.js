import crypto from "crypto";

const config = {
  name: "slot",
  aliases: ["slotmachine"],
  description: "Try your luck with the slot machine!",
  usage: "[bet]",
  credits: "Ruru",
  cooldown: 10,
  extra: {
    minBet: 100, // The minimum bet amount
  },
};

// Add more symbols to the array
const symbols = ["🍇", "🍎", "🍒", "❎", "🍌"];

const langData = {
  "en_US": {
    "slot.not_enough_money": "You don't have enough money to place this bet.",
    "slot.min_bet": "The minimum bet amount is ${minBet}.💵",
    "slot.result_win": "\n━━━━━━━━━━━━━━━\nCongratulations! You won ${winning}.💵",
    "slot.result_lose": "\n━━━━━━━━━━━━━━━\nBetter luck next time! You lost ${bet}.💸",
    "any.error": "An error occurred, please try again.",
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;

  const bet = parseInt(args[0]) || extra.minBet;

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (userMoney < bet) {
      return message.reply(getLang("slot.not_enough_money"));
    }
    if (bet < extra.minBet) {
      return message.reply(getLang("slot.min_bet", { minBet: extra.minBet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate three random symbols
    const result = Array.from({ length: 3 }, () => symbols[crypto.randomInt(symbols.length)]);

    const resultMessage = `🎰[ ${result[0]} | ${result[1]} | ${result[2]} ]🎰\n`;

    // Adjust the winning condition
    if (result.some(symbol => result.filter(s => s === symbol).length >= 2)) {
      const winning = bet * 2;
      await Users.increaseMoney(message.senderID, winning);
      const winMessage = getLang("slot.result_win", { winning });
      return message.reply(resultMessage + winMessage);
    } else {
      const loseMessage = getLang("slot.result_lose", { bet });
      return message.reply(resultMessage + loseMessage);
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
