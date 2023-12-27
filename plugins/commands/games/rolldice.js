const config = {
  name: "rolldice",
  aliases: ["dice", "roll"],
  description: "Roll a six-sided dice and try your luck to win or lose.",
  usage: "[bet]",
  credits: "Ruru",
  cooldown: 5,
  extra: {
    minbet: 50, // The minimum bet amount
  },
};

const langData = {
  "en_US": {
    "rolldice.not_enough_money": "You don't have enough money to place this bet.",
    "rolldice.min_bet": "The minimum bet amount is ₱{minBet}. 💸",
    "rolldice.result_win": "You rolled a {result} and won ₱{bet}!",
    "rolldice.result_lose": "You rolled a {result} and lost ₱{bet}. 💸",
    "any.error": "An error occurred, please try again.",
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;

  const bet = parseInt(args[0]) || extra.minbet;

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (userMoney < bet) {
      return message.reply(getLang("rolldice.not_enough_money"));
    }
    if (bet < extra.minbet) {
      return message.reply(getLang("rolldice.min_bet", { minBet: extra.minbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate a random number between 1 and 6
    const diceResult = Math.floor(Math.random() * 6) + 1;

    if (diceResult % 2 === 0) {
      const winnings = bet * 2;
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("rolldice.result_win", { result: diceResult, bet: winnings }));
    } else {
      return message.reply(getLang("rolldice.result_lose", { result: diceResult, bet }));
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
