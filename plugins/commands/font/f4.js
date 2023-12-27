const config = {
  name: "fancy4",
  aliases: [],
  description: "Generate Bold Italic Text",
  usage: "fancytext <text>",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Rue",
  extra: {}
};

const langData = {
  "en_US": {
    "boldItalicResult": "{result}"
  }
};

const boldItalicCharacters = {
  a: "𝘢",
  b: "𝘣",
  c: "𝘤",
  d: "𝘥",
  e: "𝘦",
  f: "𝘧",
  g: "𝘨",
  h: "𝘩",
  i: "𝘪",
  j: "𝘫",
  k: "𝘬",
  l: "𝘭",
  m: "𝘮",
  n: "𝘯",
  o: "𝘰",
  p: "𝘱",
  q: "𝘲",
  r: "𝘳",
  s: "𝘴",
  t: "𝘵",
  u: "𝘶",
  v: "𝘷",
  w: "𝘸",
  x: "𝘹",
  y: "𝘺",
  z: "𝘻",
  A: "𝘈",
  B: "𝘉",
  C: "𝘊",
  D: "𝘋",
  E: "𝘌",
  F: "𝘍",
  G: "𝘎",
  H: "𝘏",
  I: "𝘐",
  J: "𝘑",
  K: "𝘒",
  L: "𝘓",
  M: "𝘔",
  N: "𝘕",
  O: "𝘖",
  P: "𝘗",
  Q: "𝘘",
  R: "𝘙",
  S: "𝘚",
  T: "𝘛",
  U: "𝘜",
  V: "𝘝",
  W: "𝘞",
  X: "𝘟",
  Y: "𝘠",
  Z: "𝘡"
};

function generateBoldItalicText(inputText) {
  // Convert the input text to Bold Italic text using the boldItalicCharacters mapping
  const boldItalicText = inputText
    .split("")
    .map((char) => (boldItalicCharacters[char] || char))
    .join("");

  return boldItalicText;
}

async function onCall({ message, args, getLang }) {
  const inputText = args.join(" ");

  if (inputText) {
    const boldItalicText = generateBoldItalicText(inputText);
    message.reply(getLang("boldItalicResult", { result: boldItalicText }));
  } else {
    message.reply("Please provide text to make it in Bold Italic.");
  }
}

export default {
  config,
  langData,
  onCall
};
