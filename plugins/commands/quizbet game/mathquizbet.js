const config = {
  name: 'mathquizbet',
  aliases: ['mqb'],
  description: 'Bet on math questions and win or lose money. Use #mathquizbet <bet> to play.',
  usage: 'mathquizbet <bet>',
  cooldown: 10,
  credits: 'Rue',
};

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const timeLimit = 15;

  // Check if a valid bet amount is provided as an argument
  const bet = parseInt(args[0]);
  if (isNaN(bet) || bet <= 0) {
    message.reply('Please enter a valid bet amount.');
    return;
  }

  // Ensure the user has enough money to place the bet
  const userMoney = await Users.getMoney(message.senderID);
  if (userMoney < bet) {
    message.reply("You don't have enough money to place this bet.");
    return;
  }

  const maxBet = 5000000000;
  if (bet > maxBet) {
    message.reply(`The maximum bet is $${maxBet}.`);
    return;
  }

  const [question, correctAnswer] = generateMathQuestion();

  let userAnswered = false; // Flag to track if the user answered the question

  message.reply(`${question}\n━━━━━━━━━━━━━━━\nTime Limit: ${timeLimit} seconds. ⏱`)
    .then((data) => {
      const messageId = data.messageID;

      const timerId = setTimeout(() => {
        if (!userAnswered) { // Check if the user didn't answer
          global.api.unsendMessage(messageId);
          // User ran out of time, deduct the bet amount
          Users.decreaseMoney(message.senderID, bet);
          message.reply(`Time's up! You lose $${bet}. ⏱️`);
        }
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: getMathReply, myData: { correctAnswer, bet, messageId, timerId } });
    })
    .catch((err) => console.error(err));

  async function getMathReply({ message, eventData }) {
    clearTimeout(eventData.timerId);

    const answer = message.body;
    if (answer === correctAnswer.toString()) {
      userAnswered = true; // User answered correctly
      const winnings = bet * 2; // User wins double the bet
      Users.increaseMoney(message.senderID, winnings);
      message.reply(`Congratulations! You win $${winnings}! 💵`)
        .then(() => global.api.unsendMessage(eventData.messageID));
    } else {
      userAnswered = true; // User answered incorrectly
      // User answered incorrectly, deduct the bet amount
      Users.decreaseMoney(message.senderID, bet);
      message.reply(`Wrong! The correct answer is ${correctAnswer}. You lose $${bet}.`)
        .then(() => global.api.unsendMessage(eventData.messageID));
    }
  }
}

function generateMathQuestion() {
  const min = 1;
  const max = 100;

  const num1 = getRandomNumber(min, max);
  const num2 = getRandomNumber(min, max);
  const operation = getRandomOperation();
  let question, correctAnswer;

  switch (operation) {
    case '+':
      question = `${num1} + ${num2} = ?`;
      correctAnswer = num1 + num2;
      break;
    case '-':
      question = `${num1} - ${num2} = ?`;
      correctAnswer = num1 - num2;
      break;
    case '*':
      question = `${num1} * ${num2} = ?`;
      correctAnswer = num1 * num2;
      break;
    case '/':
      if (num2 === 0) num2 = 1; // Avoid division by zero
      question = `${num1} / ${num2} = ?`;
      correctAnswer = (num1 / num2).toFixed(2);
      break;
  }

  return [question, correctAnswer];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomOperation() {
  const operations = ['+', '-', '*', '/'];
  const randomIndex = Math.floor(Math.random() * operations.length);
  return operations[randomIndex];
}

export default {
  config,
  onCall,
};
