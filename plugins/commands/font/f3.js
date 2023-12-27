const config = {
  name: "fancy3",
  aliases: [],
  description: "Generate Monospace Text",
  usage: "fancytext <text>",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Rue",
  extra: {}
};

const langData = {
  "en_US": {
    "monospaceResult": "{result}"
  }
};

const monospaceCharacters = {
  a: "𝚊",
  b: "𝚋",
  c: "𝚌",
  d: "𝚍",
  e: "𝚎",
  f: "𝚏",
  g: "𝚐",
  h: "𝚑",
  i: "𝚒",
  j: "𝚓",
  k: "𝚔",
  l: "𝚕",
  m: "𝚖",
  n: "𝚗",
  o: "𝚘",
  p: "𝚙",
  q: "𝚚",
  r: "𝚛",
  s: "𝚜",
  t: "𝚝",
  u: "𝚞",
  v: "𝚟",
  w: "𝚠",
  x: "𝚡",
  y: "𝚢",
  z: "𝚣",
  A: "𝙰",
  B: "𝙱",
  C: "𝙲",
  D: "𝙳",
  E: "𝙴",
  F: "𝙵",
  G: "𝙶",
  H: "𝙷",
  I: "𝙸",
  J: "𝙹",
  K: "𝚺",
  L: "𝙻",
  M: "𝙼",
  N: "𝙽",
  O: "𝙾",
  P: "𝙿",
  Q: "𝚚",
  R: "𝚛",
  S: "𝚜",
  T: "𝚝",
  U: "𝚞",
  V: "𝚟",
  W: "𝚠",
  X: "𝚡",
  Y: "𝚢",
  Z: "𝚣"
};

function generateMonospaceText(inputText) {
  // Convert the input text to Monospace text using the monospaceCharacters mapping
  const monospaceText = inputText
    .split("")
    .map((char) => (monospaceCharacters[char] || char))
    .join("");

  return monospaceText;
}

async function onCall({ message, args, getLang }) {
  const inputText = args.join(" ");

  if (inputText) {
    const monospaceText = generateMonospaceText(inputText);
    message.reply(getLang("monospaceResult", { result: monospaceText }));
  } else {
    message.reply("Please provide text to make it in Monospace.");
  }
}

export default {
  config,
  langData,
  onCall
};
