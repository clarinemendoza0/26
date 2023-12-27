import fs from 'fs';
import { join } from 'path';

const config = {
  name: "filipinoquiz",
  aliases: ["quiz", "fq", "pinoyquiz"],
  description: "Subukan ang iyong kaalaman sa pamamagitan ng kuwentuhan tungkol sa mga bagay tungkol sa Pilipinas. Magtaya ng pera upang manalo o mawalan.",
  usage: "<halaga ng pusta>",
  cooldown: 10,
  credits: "Rue"
};

const quizDataPath = join(global.assetsPath, 'filipinoquiz.json');

let quizData = [];

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
    shuffleArray(quizData); // Shuffle the quizData array
  } catch (err) {
    console.error('Nabigo ang pag-load ng datos ng Filipinoquiz:', err);
  }
}

loadQuizData();

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;

  const userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("Mangyaring maglagay ng wastong halaga ng pusta.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("Wala ka ng sapat na pera upang magtaya ng halagang ito.");
  }

  const maxBet = 5000000000;

  if (maxBet < userBet) {
    return message.reply(`Ang pinakamataas na pusta ay ₱${maxBet.toLocaleString()}.`);
  }

  // Pumili ng isang tanong mula sa Filipinoquiz nang random
  const randomIndex = Math.floor(Math.random() * quizData.length);
  const questionData = quizData[randomIndex];
  const question = questionData.question;
  const correctAnswer = questionData.answer;

  const timeLimit = 15; // Limitasyon ng oras sa mga segundo

  const questionText = `${question}\n━━━━━━━━━━━━━━━\nOras: ${timeLimit} segundo ⏱`;

  message.reply(questionText)
    .then(data => {
      const messageId = data.messageID;

      // Itakda ang timer para sa limitasyon ng oras
      const timerId = setTimeout(() => {
        message.reply("Tapos na ang oras! Hindi ka sumagot sa oras.")
          .then(() => global.api.unsendMessage(messageId));
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: handleFilipinoQuiz, myData: { correctAnswer, messageId, timerId, userBet } });
    })
    .catch(err => console.error(err));
}

async function handleFilipinoQuiz({ message, eventData }) {
  // I-clear ang timer dahil sumagot na ang user
  clearTimeout(eventData.myData.timerId);

  const userAnswer = message.body;
  const { Users } = global.controllers;

  if (userAnswer.toLowerCase() === eventData.myData.correctAnswer.toLowerCase()) {
    const winnings = eventData.myData.userBet * 1;
    await Users.increaseMoney(message.senderID, winnings);
    message.reply(`Tama ang sagot! Nanalo ka ng ₱${winnings}! 🎉`);
  } else {
    await Users.decreaseMoney(message.senderID, eventData.myData.userBet);
    message.reply(`Mali ang sagot! Ang tamang sagot ay "${eventData.myData.correctAnswer}". Nawala mo ang ₱${eventData.myData.userBet}.`);
  }

  // I-unsend ang mensahe ng tanong
  global.api.unsendMessage(eventData.myData.messageId);
}

export default {
  config,
  onCall
};
