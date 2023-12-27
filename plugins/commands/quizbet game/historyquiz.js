import fs from 'fs';
import { join } from 'path';

const config = {
  name: "historyquiz",
  aliases: ["quiz", "hq", "historicaltrivia"],
  description: "Test your historical knowledge with a history quiz. Place a bet to win or lose money.",
  usage: "<bet amount>",
  cooldown: 10,
  credits: "Rue"
};

const quizDataPath = join(global.assetsPath, 'historyquiz.json');

let quizData = [];

// Function to shuffle an array using Fisher-Yates (Knuth) shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadQuizData() {
  try {
    const data = fs.readFileSync(quizDataPath, 'utf8');
    quizData = JSON.parse(data);
    shuffleArray(quizData); // Shuffle the quiz data array
  } catch (err) {
    console.error('Failed to load history quiz data:', err);
  }
}

loadQuizData();

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;

  const userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("Please enter a valid bet amount.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("You don't have enough money to place this bet.");
  }

  const maxBet = 100000;

  if (maxBet < userBet) {
    return message.reply(`The maximum bet is ₱${maxBet.toLocaleString()}.`);
  }

  // Randomly select a history quiz question
  const questionData = quizData.pop(); // Get the last question from the shuffled array
  const question = questionData.question;
  const correctAnswer = questionData.answer;

  const timeLimit = 30; // Time limit in seconds

  const questionText = `${question}\n━━━━━━━━━━━━━━━\nTime Limit: ${timeLimit} seconds ⏱`;

  message.reply(questionText)
    .then(data => {
      const messageId = data.messageID;

      // Set the timer for the time limit
      const timerId = setTimeout(() => {
        message.reply("Time's up! You didn't answer in time.")
          .then(() => global.api.unsendMessage(messageId));
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: handleHistoryQuiz, myData: { correctAnswer, messageId, timerId, userBet } });
    })
    .catch(err => console.error(err));
}

async function handleHistoryQuiz({ message, eventData }) {
  // Clear the timer since the user has answered
  clearTimeout(eventData.myData.timerId);

  const userAnswer = message.body;
  const { Users } = global.controllers;

  if (userAnswer.toLowerCase() === eventData.myData.correctAnswer.toLowerCase()) {
    const winnings = eventData.myData.userBet * 1;
    await Users.increaseMoney(message.senderID, winnings);
    message.reply(`Correct answer! You won ₱${winnings}! 🎉`);
  } else {
    await Users.decreaseMoney(message.senderID, eventData.myData.userBet);
    message.reply(`Wrong answer! The correct answer was "${eventData.myData.correctAnswer}". You lost ₱${eventData.myData.userBet}.`);
  }

  // Unsend the question message
  global.api.unsendMessage(eventData.myData.messageId);

  // Check if there are more questions to ask, if not, reload and shuffle the quiz data
  if (quizData.length === 0) {
    loadQuizData();
  }
}

export default {
  config,
  onCall
};
