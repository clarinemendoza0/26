const config = {
  name: 'algebraquiz',
  aliases: ['aq'],
  description: 'Multiply algebraic expressions to win or lose money. Use #algebraquiz <bet> to play.',
  usage: 'algebra <bet>',
  cooldown: 10,
  credits: 'Ariél Violét (Modified by Dymyrius)',
};

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const timeLimit = 30;

  // Check if a valid bet amount is provided as an argument
  const bet = parseInt(args[0]);
  if (isNaN(bet) || bet <= 0) {
    message.reply('𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.');
    return;
  }

  // Ensure the user has enough money to place the bet
  const userMoney = await Users.getMoney(message.senderID);
  if (userMoney < bet) {
    message.reply('𝚈𝚘𝚞 𝚍𝚘𝚗\'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.');
    return;
  }

  const maxBet = 5000000000;
  if (maxBet < bet) {
    message.reply(`𝚃𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚒𝚜 ₱${maxBet.toLocaleString()}.`);
    return;
  }

  const [question, correctAnswer] = generateAlgebraicQuestion();

  let userAnswered = false; // Flag to track if the user answered the question

  message.reply(`${question}\n━━━━━━━━━━━━━━━\n𝚃𝚒𝚖𝚎 𝙻𝚒𝚖𝚒𝚝: ${timeLimit} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜. ⏱`)
    .then((data) => {
      const messageId = data.messageID;

      const timerId = setTimeout(() => {
        if (!userAnswered) { // Check if the user didn't answer
          global.api.unsendMessage(messageId);
          // User ran out of time, deduct the bet amount
          Users.decreaseMoney(message.senderID, bet);
          message.reply(`𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚕𝚘𝚜𝚎 ₱${bet}. ⏱️`);
        }
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: getAlgebraReply, myData: { correctAnswer, bet, messageId, timerId } });
    })
    .catch((err) => console.error(err));

  async function getAlgebraReply({ message, eventData }) {
    clearTimeout(eventData.timerId);

    const answer = message.body;
    if (answer === correctAnswer.toString()) {
      userAnswered = true; // User answered correctly
      const winnings = bet * 2; // User wins double the bet
      Users.increaseMoney(message.senderID, winnings);
      message.reply(`𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞 𝚠𝚘𝚗 ₱${winnings}! 💵`)
      .then(() => global.api.unsendMessage(eventData.messageID));
    } else {
      userAnswered = true; // User answered incorrectly
      // User answered incorrectly, deduct the bet amount
      Users.decreaseMoney(message.senderID, bet);
      message.reply(`𝚆𝚛𝚘𝚗𝚐! 𝚃𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚒𝚜 " ${correctAnswer} ". 𝚈𝚘𝚞 𝚕𝚘𝚜𝚎 ₱${bet}.`)
      .then(() => global.api.unsendMessage(eventData.messageID));
    }
  }
}

function generateAlgebraicQuestion() {
  const min = 1;
  const max = 10;

  const num1 = getRandomNumber(min, max);
  const num2 = getRandomNumber(min, max);
  const variable = getRandomVariable();
  let exponent1, exponent2;

  do {
    exponent1 = getRandomExponent();
    exponent2 = getRandomExponent();
  } while (exponent1 === exponent2);

  const question = `${num1}${variable}^${exponent1} * (${num2}${variable}^${exponent2}) = ?`;
  const correctAnswer = num1 * num2;

  return [question, correctAnswer];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomVariable() {
  const variables = ['x', 'y'];
  const randomIndex = Math.floor(Math.random() * variables.length);
  return variables[randomIndex];
}

function getRandomExponent() {
  const exponents = ['2', '3', '4'];
  const randomIndex = Math.floor(Math.random() * exponents.length);
  return exponents[randomIndex];
}

export default {
  config,
  onCall,
};