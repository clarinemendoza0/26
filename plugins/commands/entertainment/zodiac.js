import axios from 'axios';

const config = {
  name: 'zodiac',
  version: '1.0.2',
  credits: 'August Quinn (Convert ed by Grim',
  description: 'Get information about a zodiac sign.',
  usage: '[sign]',
  cooldown: 5,
};

const zodiacImages = {
  aries: 'https://i.imgur.com/KB9NCDk.jpg',
  taurus: 'https://i.imgur.com/jDbEKhi.jpg',
  gemini: 'https://i.imgur.com/l6Xb2Xh.jpg',
  cancer: 'https://i.imgur.com/FtYSa1W.jpg',
  leo: 'https://i.imgur.com/TvGeiT5.jpg',
  virgo: 'https://i.imgur.com/SlHKUcE.jpg',
  libra: 'https://i.imgur.com/ciCsxcO.jpg',
  scorpio: 'https://i.imgur.com/s7iJsXb.jpg',
  sagittarius: 'https://i.imgur.com/tOWvs4N.jpg',
  capricorn: 'https://i.imgur.com/EF3C6QB.jpg',
  aquarius: 'https://i.imgur.com/TVTXfxg.jpg',
  pisces: 'https://i.imgur.com/mU7IJlC.jpg'
};

async function onCall({ message, args, prefix }) {
  const { messageID, threadID } = message;
  try {
    const sign = args[0]?.toLowerCase();

    if (!sign) {
      return global.api.sendMessage(`Please provide a zodiac sign. Example: ${prefix}${config.name} aries`, threadID, messageID);
    }

    const jsonLink = 'https://raw.githubusercontent.com/Augustquinn/JSONify/main/ZodiacSigns.json';
    const response = await axios.get(jsonLink);
    const zodiacData = response.data.zodiacSigns;

    const foundSign = zodiacData.find((zodiac) => zodiac.sign.toLowerCase() === sign);

    if (foundSign) {
      const message = formatZodiacInfo(foundSign, sign);

      if (zodiacImages[sign]) {
        const imageStream = await axios.get(zodiacImages[sign], { responseType: 'stream' });

        global.api.sendMessage({
          body: message,
          attachment: imageStream.data
        }, threadID, messageID);
      } else {
        global.api.sendMessage('No image found for this zodiac sign.', threadID, messageID);
      }

    } else {
      global.api.sendMessage('Invalid zodiac sign. Please provide a valid sign.', threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    global.api.sendMessage('An error occurred while fetching zodiac information.', threadID, messageID);
  }
}

function formatZodiacInfo(zodiacInfo, sign) {
  return `
✨ 𝗭𝗢𝗗𝗜𝗔𝗖 𝗦𝗜𝗚𝗡 - ${sign}

⦿ 𝗡𝗔𝗠𝗘: ${zodiacInfo.sign}
⦿ 𝗘𝗟𝗘𝗠𝗘𝗡𝗧: ${zodiacInfo.element}
⦿ 𝗥𝗨𝗟𝗜𝗡𝗚 𝗣𝗟𝗔𝗡𝗘𝗧: ${zodiacInfo.rulingPlanet}
⦿ 𝗧𝗥𝗔𝗜𝗧𝗦: ${zodiacInfo.traits.join(', ')}
⦿ 𝗖𝗢𝗠𝗣𝗔𝗧𝗜𝗕𝗜𝗟𝗜𝗧𝗬: ${zodiacInfo.compatibility.join(', ')}
⦿ 𝗠𝗢𝗧𝗜𝗩𝗔𝗧𝗜𝗢𝗡𝗦: ${getRandomItem(zodiacInfo.motivations)}
⦿ 𝗟𝗨𝗖𝗞𝗬 𝗡𝗨𝗠𝗕𝗘𝗥: ${zodiacInfo.luckyNumber}
⦿ 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟𝗜𝗧𝗬: ${zodiacInfo.personality}
⦿ 𝗟𝗨𝗖𝗞𝗬 𝗖𝗢𝗟𝗢𝗥: ${zodiacInfo.luckyColor}
`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default {
  config,
  onCall
};