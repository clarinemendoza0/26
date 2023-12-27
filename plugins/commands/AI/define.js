import axios from 'axios';

const config = {
  name: "define",
  version: "1.0",
  credits: "Grim",
  author: "August Quinn & kshitiz",
  countDown: 5,
  role: 0,
  shortDescription: "",
  longDescription: "Retrieve definitions and meanings of English words",
  category: "info",
  guide: "{pn}define [word]"
}

async function onCall({ message, args }) {
  if (args.length < 1) {
    return message.reply("Please provide a word to look up.");
  }

  const word = args[0];

  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`;// Use 'en_US' for American English
    const response = await axios.get(apiUrl);

    if (response.data && response.data.length > 0) {
      const entry = response.data[0];

      const meanings = entry.meanings.map((meaning) => {
        const partOfSpeech = meaning.partOfSpeech;
        const definitions = meaning.definitions.map((definition) => `  ⌲ ${definition.definition}`).join("\n");
        return `  ❑ ${partOfSpeech}\n${definitions}`;
      }).join("\n\n");

      let messages = `𝗪𝗢𝗥𝗗: ${entry.word}\n`;

      if (entry.phonetics && entry.phonetics.length > 0) {
        messages += `𝗣𝗛𝗢𝗡𝗘𝗧𝗜𝗖: ${entry.phonetics[0].text}\n`;
        if (entry.phonetics[0].audio) {
          messages += `𝗔𝗨𝗗𝗜𝗢: ${entry.phonetics[0].audio}\n`;
        }
      }

      if (entry.origin) {
        messages += `𝗢𝗥𝗜𝗚𝗜𝗡: ${entry.origin}\n`;
      }

      if (meanings) {
        messages += `\n𝗠𝗘𝗔𝗡𝗜𝗡𝗚𝗦\n${meanings}`;
      } else {
        messages += "No meanings found.";
      }

      message.reply(messages);
    } else {
      message.reply("Word not found or an error occurred.");
    }
  } catch (err) {
    console.error(err);
    message.reply("An error occurred while fetching the definition.");
  }
};

export default {
  config,
  onCall
}