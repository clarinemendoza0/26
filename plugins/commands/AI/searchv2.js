import axios from 'axios';


const mathSansBold = {
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭", a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢",
  j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫",
  s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳", 0: "𝟎",
  1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗"
};

export default {
  config: {
    name: "searchv2",
    aliases: [],
    credits: "kshitiz",
    version: "2.0",
    cooldown: 5,
    role: 0,
    description: "Use this code to know synonyms and antonyms of any English word {p}{n} word | synonyms or {p}{n} word | antonyms"
  },
  
  onCall: async function({ args , message }) {
    const tzt = args.join(" ").split("|").map(item => item.trim());


    if (!args[0] || tzt.length !== 2) {
      message.reply("Invalid command format. Please use: {p}search word | synonyms or {p}search word | antonyms");
      return;
    }

    const word = tzt[0];
    const type = tzt[1].toLowerCase();


    if (type !== 'synonyms' && type !== 'antonyms') {
      message.reply("Invalid command format. Please use: {p}search word | synonyms or {p}search word | antonyms");
      return;
    }

    try {
      const apiKey = '0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn';
      const apiUrl = `https://api.api-ninjas.com/v1/thesaurus?word=${word}`;
      const response = await axios.get(apiUrl, { headers: { 'X-Api-Key': apiKey } });

      const result = response.data;
      let list;

      if (type === 'synonyms') {
        list = result.synonyms.join(', ');
      } else {
        list = result.antonyms.join(', ');
      }

      message.reply(`𝐋𝐢𝐬𝐭 𝐎𝐟   *${mathSansBold[type.charAt(0).toUpperCase()] + type.slice(1)}* 𝐅𝐨𝐫   *${mathSansBold[word.charAt(0).toUpperCase()] + word.slice(1)}*: \n\n${list}`);
    } catch (error) {
      console.error('Error:', error.message);
      message.reply('An error occurred while fetching data. Please try again later.');
    }
  },
};