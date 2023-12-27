const config = {
  name: "evenodds",
  aliases: ["eo"],
  description: "Guess if a random number is even or odd.",
  usage: "[even/e] [bet] or [odd/o] [bet]",
  credits: "Rue",
  versions: "1.0.0",
  extra: {
    minbet: 50, // The minimum bet amount
  },
};

const langData = {
  "en_US": {
    "evenodds.userNoData": "User data is not available.",
    "evenodds.invalidChoice": "𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚌𝚑𝚘𝚒𝚌𝚎, 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚑𝚘𝚒𝚌𝚎𝚜: 𝚎𝚟𝚎𝚗 (𝚎) 𝚘𝚛 𝚘𝚍𝚍 (𝚘).",
    "evenodds.notEnoughMoney": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.",
    "evenodds.minbet": "𝙼𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 𝚒𝚜 {minBet} 💵.",
    "evenodds.win": "𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜!  𝚈𝚘𝚞 𝚠𝚘𝚗 {bet} 💵.",
    "evenodds.lose": "𝚂𝚘𝚛𝚛𝚢! 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 {bet} 💸.",
    "evenodds.error": "𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚑𝚊𝚜 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.",
  },
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;
  const validChoices = ["e", "even", "o", "odd"];

  const choice = args[0]?.toLowerCase();
  const bet = BigInt(args[1] || extra.minbet);

  if (!choice || !validChoices.includes(choice)) {
    const validStr = validChoices.filter((c, i) => i % 2 === 0).join(" (") + ") or " + validChoices.filter((c, i) => i % 2 !== 0).join(" (");
    return message.reply(getLang("evenodds.invalidChoice", { validChoices: validStr }));
  }

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("evenodds.userNoData"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("evenodds.notEnoughMoney"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("evenodds.minbet", { minBet: extra.minbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    const randomNum = Math.floor(Math.random() * 100); // Generates a random number between 0 and 99
    const isEven = randomNum % 2 === 0;
    const didWin = (choice === "e" || choice === "even") ? isEven : (choice === "o" || choice === "odd") ? !isEven : false;

    const winnings = didWin ? bet * BigInt(2) : BigInt(0);
    if (didWin) {
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("evenodds.win", { bet: winnings }));
    } else {
      return message.reply(getLang("evenodds.lose", { bet }));
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("evenodds.error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
