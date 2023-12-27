const config = {
  name: "scratch2win",
  aliases: ["scratcher", "scratchcard"],
  description: "Scratch the card and aim for a winning combination.",
  usage: "[positions] [bet]",
  credits: "Grim",
  cooldown: 5,
  permissions: [0],
  extra: {
    minbet: 50,
  },
  fruits: ["🍎", "🍐", "🍊", "🍋", "🍉", "🍇", "🍓", "🍒", "🍌", "🪙"],
  bomb: "💣",
};

const langData = {
  "en_US": {
    "scratch.invalid_format": "Invalid format! Please use the format: `scratch <position1> <position2> <position3> <bet>`.",
    "scratch.not_enough_money": "You don't have enough money to place this bet.",
    "scratch.win_message": "Congratulations! You won ₱{winnings}. 🎉",
    "scratch.lose_message": "Sorry, you didn't win this time."
  },
  "es_ES": {
    "scratch.invalid_format": "¡Formato inválido! Por favor, utiliza el formato: `scratch <posición1> <posición2> <posición3> <apuesta>`.",
    "scratch.not_enough_money": "No tienes suficiente dinero para realizar esta apuesta.",
    "scratch.win_message": "¡Felicidades! Ganaste ₱{winnings}. 🎉",
    "scratch.lose_message": "Lo siento, no ganaste en esta ocasión."
  }
};

  async function onCall({ message, args, extra, getLang, prefix }) {
  if (args.length < 4) {
    return message.reply(`Please enter your pattern and bet amount.\nPATTERNS:\n\n1️⃣|2️⃣|3️⃣\n4️⃣|5️⃣|6️⃣\n7️⃣|8️⃣|9️⃣\n\nFor Example: ${prefix}${config.name} 1 5 9 10000`);
  }

  const { Users } = global.controllers;
  const validPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const bet = BigInt(args.pop() || extra.minbet);
  const positions = args.map(pos => parseInt(pos));

  const uniquePositions = new Set(positions);
  if (uniquePositions.size !== positions.length) {
    return message.reply('Invalid pattern. All positions must be unique.');
  }

  for (const pos of positions) {
    if (!validPositions.includes(pos)) {
      return message.reply(getLang("scratch.invalid_positions"));
    }
  }

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("scratch.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("flipcoin.min_bet", { minBet: extra.minbet }));
    }

    const card = generateRandomCard();
    const revealedFruits = scratchCard(card, positions);
    const cardDisplay = generateCardDisplay(card);
    const revealedDisplay = generateCardDisplay(revealedFruits);
    const revealMessage = `Revealed fruits at positions ${positions.join(', ')}:\n${revealedDisplay}`;
    const winMultiplier = checkWinningCombination(revealedFruits);

    if (winMultiplier) {
      const winnings = calculateWinnings(bet, winMultiplier);
      await Users.increaseMoney(message.senderID, winnings);

      const resultMessage = getLang("scratch.win_message", { winnings });
      const replyMessage = `Here's your scratch card:\n${cardDisplay}\n\n${revealMessage}\n\n${resultMessage}`;
      return message.reply(replyMessage);
    } else {
      await Users.decreaseMoney(message.senderID, bet);

      const resultMessage = getLang("scratch.lose_message", { bet });
      const replyMessage = `Here's your scratch card:\n${cardDisplay}\n\n${revealMessage}\n\n${resultMessage}`;
      return message.reply(replyMessage);
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

function generateRandomCard() {
  const { fruits, bomb } = config;
  const card = [];
  const totalPositions = 9;

  const revealedPositions = [1, 2, 3];

  for (let i = 0; i < totalPositions; i++) {
    if (revealedPositions.includes(i + 1)) {

      const randomIndex = Math.floor(Math.random() * fruits.length);
      card.push(fruits[randomIndex]);
    } else {

      const randomChance = Math.random() * 100;
      if (randomChance < 50) {
        const randomIndex = Math.floor(Math.random() * fruits.length);
        card.push(fruits[randomIndex]);
      } else if (randomChance >= 50 && randomChance < 90) {
        const randomIndex = Math.floor(Math.random() * totalPositions);
        card.push(bomb);
      } else {
        const randomIndex = fruits.findIndex(fruit => fruit === '🪙');
        card.push(fruits[randomIndex]);
      }
    }
  }

  return card;
}

function scratchCard(card, positions) {
  const revealedFruits = [];
  for (const pos of positions) {
    revealedFruits.push(card[pos - 1]);
  }
  return revealedFruits;
}

function checkWinningCombination(revealedFruits) {
  const { bomb, fruits } = config;

  if (revealedFruits.includes(bomb)) {
    return false;
  }

  // Shuffle the revealed fruits for a more random win probability
  const shuffledFruits = shuffle(revealedFruits);

  // Check for two identical fruits in the shuffled array
  for (let i = 0; i < shuffledFruits.length - 1; i++) {
    if (shuffledFruits[i] === shuffledFruits[i + 1] && shuffledFruits[i] !== '🪙') {
      return true;
    }
  }

  return false;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function calculateWinnings(bet, winMultiplier) {
  return bet * BigInt(winMultiplier);
}

function generateCardDisplay(card) {
  let display = "";
  for (let i = 0; i < card.length; i++) {
    display += card[i];
    if ((i + 1) % 3 === 0) {
      display += "\n";
    } else {
      display += "|";
    }
  }
  return display.trim();
}

export default {
  config,
  langData,
  onCall,
};