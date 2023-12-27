import fs from 'fs';
import { join } from 'path';

const config = {
  name: "wordgame",
  aliases: ["unscramble", "word"],
  description: "Unscramble the given word to win money.",
  usage: "",
  cooldown: 10,
  credits: "Dymyrius"
};

const wordsDataPath = join(global.assetsPath, 'word.json'); // Specify the path to the word.json file

let wordsData = [];

// Load words and hints from the file
function loadWordsData() {
  try {
    const data = fs.readFileSync(wordsDataPath, 'utf8');
    wordsData = JSON.parse(data);
  } catch (err) {
    console.error('𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚕𝚘𝚊𝚍 𝚠𝚘𝚛𝚍𝚜 𝚍𝚊𝚝𝚊:', err);
  }
}

loadWordsData();

// Helper function to shuffle the characters of a word
function shuffleWord(word) {
  const shuffledWord = word.split('').sort(() => Math.random() - 0.5).join('');
  return shuffledWord !== word ? shuffledWord : shuffleWord(word); // Ensure shuffled word is different from the original
}

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;
  const userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.");
  }

  if (userBet > 5000000000000) {
    return message.reply("𝚃𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚒𝚜 𝚘𝚗𝚕𝚢 ₱5000000000000.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.");
  }

  await Users.decreaseMoney(message.senderID, userBet);

  const randomWordData = wordsData[Math.floor(Math.random() * wordsData.length)];
  const word = randomWordData.word.toLowerCase();
  const hint = randomWordData.hint;

  const scrambledWord = shuffleWord(word);

  const timeLimit = 25; // Time limit in seconds

  const questionText = `𝚄𝚗𝚜𝚌𝚛𝚊𝚖𝚋𝚕𝚎 𝚝𝚑𝚎 𝚠𝚘𝚛𝚍: ${scrambledWord}\n𝙷𝚒𝚗𝚝: ${hint}\n━━━━━━━━━━━━━━━\n𝚃𝚒𝚖𝚎 𝙻𝚒𝚖𝚒𝚝: ${timeLimit} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜. ⏱`;

  message.reply(questionText)
    .then(data => {
      const messageId = data.messageID;

      // Set the timer for the time limit
      const timerId = setTimeout(() => {
        message.reply("𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚞𝚗𝚜𝚌𝚛𝚊𝚖𝚋𝚕𝚎 𝚝𝚑𝚎 𝚠𝚘𝚛𝚍 𝚒𝚗 𝚝𝚒𝚖𝚎.")
          .then(() => global.api.unsendMessage(messageId));
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: handleWordUnscramble, myData: { word, userBet, messageId, timerId } });
    })
    .catch(err => console.error(err));

async function handleWordUnscramble({ message, eventData }) {
  // Clear the timer since the user has made a choice
  clearTimeout(eventData.myData.timerId);

  const answer = message.body.toLowerCase();
  const messageId = eventData.myData.messageId;

  if (answer === eventData.myData.word) {
    const winnings = eventData.myData.userBet * 2;
    await Users.increaseMoney(message.senderID, winnings);
    message.reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 ₱${winnings}! 🪙`, { quote: true });
  } else {
    message.reply(`𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚃𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚠𝚘𝚛𝚍 𝚠𝚊𝚜 "${eventData.myData.word}". 𝙱𝚎𝚝 𝚋𝚎𝚝𝚝𝚎𝚛 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎.`, { quote: true });
  }

  // Unsend the question message
  global.api.unsendMessage(messageId);
}
}


export default {
  config,
  onCall
};