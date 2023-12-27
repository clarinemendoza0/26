const config = {
  name: "fancy2",
  aliases: [],
  description: "Generate Benson Script text",
  usage: "fancytext <text>",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Rue",
  extra: {}
};

const langData = {
  "en_US": {
    "bensonScriptResult": "{result}"
  }
};

const bensonScriptCharacters = {
  a: "𝒶",
  b: "𝒷",
  c: "𝒸",
  d: "𝒹",
  e: "ℯ",
  f: "𝒻",
  g: "ℊ",
  h: "𝒽",
  i: "𝒾",
  j: "𝒿",
  k: "𝓀",
  l: "𝓁",
  m: "𝓂",
  n: "𝓃",
  o: "ℴ",
  p: "𝓅",
  q: "𝓆",
  r: "𝓇",
  s: "𝓈",
  t: "𝓉",
  u: "𝓊",
  v: "𝓋",
  w: "𝓌",
  x: "𝓍",
  y: "𝓎",
  z: "𝓏",
  A: "𝒜",
  B: "ℬ",
  C: "𝒞",
  D: "𝒟",
  E: "ℰ",
  F: "ℱ",
  G: "𝒢",
  H: "ℋ",
  I: "ℐ",
  J: "𝒥",
  K: "𝒦",
  L: "ℒ",
  M: "ℳ",
  N: "𝒩",
  O: "ℴ",
  P: "𝒫",
  Q: "𝒬",
  R: "ℛ",
  S: "𝒮",
  T: "𝒯",
  U: "𝒰",
  V: "𝒱",
  W: "𝒲",
  X: "𝒳",
  Y: "𝒴",
  Z: "𝒵"
};

function generateBensonScriptText(inputText) {
  // Convert the input text to Benson Script text using the bensonScriptCharacters mapping
  const bensonScriptText = inputText
    .split("")
    .map((char) => (bensonScriptCharacters[char] || char))
    .join("");

  return bensonScriptText;
}

async function onCall({ message, args, getLang }) {
  const inputText = args.join(" ");

  if (inputText) {
    const bensonScriptText = generateBensonScriptText(inputText);
    message.reply(getLang("bensonScriptResult", { result: bensonScriptText }));
  } else {
    message.reply("Please provide text to make it in Benson Script.");
  }
}

export default {
  config,
  langData,
  onCall
};
