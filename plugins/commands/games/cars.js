import fs from 'fs';
import axios from 'axios';
import { join } from 'path';


const config = {
  name: "car",
  aliases: ["vehicle"],
  version: "3.1.2",
  description: "Manage your car garage",
  usage: "<buy/available/inventory/check/upgrade/dragrace/transfer/sell>",
  cooldown: 8,
  credits: "Duke Agustin"
};

const langData = {
  "en_US": {
    "car.introduction": "𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗖𝗮𝗿 𝗚𝗮𝗿𝗮𝗴𝗲!!👨🏻‍🔧\n\n𝙷𝚎𝚛𝚎, 𝚢𝚘𝚞 𝚌𝚊𝚗 𝚖𝚊𝚗𝚊𝚐𝚎 𝚢𝚘𝚞𝚛 𝚌𝚊𝚛 𝚌𝚘𝚕𝚕𝚎𝚌𝚝𝚒𝚘𝚗, 𝚋𝚞𝚢 𝚗𝚎𝚠 𝚌𝚊𝚛𝚜, 𝚊𝚗𝚍 𝚎𝚡𝚙𝚕𝚘𝚛𝚎 𝚝𝚑𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚟𝚎𝚑𝚒𝚌𝚕𝚎𝚜. 𝙹𝚞𝚜𝚝 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚏𝚘𝚕𝚕𝚘𝚠𝚒𝚗𝚐 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜:\n\n" +
      "• #car buy <carName>: Purchase a new car for your collection.\n" +
      "• #car available: View the cars available for purchase.\n" +
      "• #car check: Check the car in your garage.\n" +
      "• #car upgrade/upgradeall: Upgrade you car and \n" +
      "• #car inventory: Check all the cars in your garage.\n" +
      "• #car dragrace <carname> <bet_amount>: Drag race with other cars to win money\n" +
      "• #car transfer <uid> <carname>: Send/transfer car to another user\n" +
      "• #car sell <carname>: Sell car/s\n" +
      "𝐂𝐚𝐧 𝐲𝐨𝐮 𝐛𝐞𝐜𝐨𝐦𝐞 𝐭𝐡𝐞 𝐮𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐜𝐚𝐫 𝐚𝐟𝐢𝐜𝐢𝐨𝐧𝐚𝐝𝐨?",
    "car.buySuccess": "『Congratulations!👨🏻‍💼』\n 𝚈𝚘𝚞'𝚟𝚎 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎𝚍 𝚊 {carName} 𝚏𝚘𝚛 {carPrice} 💵.\n\n𝚈𝚘𝚞𝚛 𝚗𝚎𝚠 𝚋𝚊𝚕𝚊𝚗𝚌𝚎: {newBalance} 💵.",
    "car.buyFailure": "『👨🏻‍💼』\n𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚋𝚞𝚢 𝚝𝚑𝚒𝚜 𝚌𝚊𝚛.",
    "car.noCars": "There are no cars available in the garage.",
    "car.inventory": "𝐘𝐨𝐮𝐫 𝐜𝐚𝐫 𝐠𝐚𝐫𝐚𝐠𝐞 𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲:\n\n{inventoryList}"
  },
};

const carData = [
  {
    name: "BugattiVeyron",
    price: 55000000000000,
    image: "https://i.imgur.com/Jyf6BcB.jpg"
  },
  {
    name: "BugattiChiron",
    price: 62000000000000,
    image: "https://i.imgur.com/aVwJP1H.jpg"
  },
  {
    name: "ToyotaSupra",
    price: 45000000000000,
    image: "https://i.imgur.com/MDU9b62.jpg"
  }, 
  {
    name: "NissanSkyline",
    price: 42000000000000,
    image: "https://i.imgur.com/Hyfq1l4.jpg"
  }, 
  {
    name: "ToyotaAE86",
    price: 35000000000000,
    image: "https://i.imgur.com/PSXSY5X.jpg"
  }, 
  {
    name: "NissanSilvia",
    price: 30000000000000,
    image: "https://i.imgur.com/jywcYk4.jpg"
  },   
  {
    name: "MazdaRX7",
    price: 45000000000000,
    image: "https://i.imgur.com/TOci8Ec.jpg"
  },
  {
    name: "MazdaMiata",
    price: 35000000000000,
    image: "https://i.imgur.com/aar3HNT.jpg"
  },
  {
    name: "FordGTMk2",
    price: 51000000000000,
    image: "https://i.imgur.com/OmGx2WU.jpg"
  },
  {
    name: "MCLarenP1",
    price: 53000000000000,
    image: "https://i.imgur.com/Roc36cK.jpg"
  },
  {
    name: "FerrariLaFerrari",
    price: 55000000000000,
    image: "https://i.imgur.com/kTXfmlz.jpg"
  },  
  {
    name: "TeslaCybertruck",
    price: 40000000000000,
    image: "https://i.imgur.com/J3UaLZA.jpg"
  },  
  {
    name: "RollsRoyceGhost",
    price: 53000000000000,
    image: "https://i.imgur.com/62S3yhc.jpg"
  }, 
  {
    name: "RollsRoycePhatom",
    price: 51000000000000,
    image: "https://i.imgur.com/RKeXva2.jpg"
  }, 
  {
    name: "DodgeCharger",
    price: 40000000000000,
    image: "https://i.imgur.com/dNkcf3t.jpg"
  }, 
  {
    name: "DodgeChallenger",
    price: 45000000000000,
    image: "https://i.imgur.com/m6pKyAX.jpg"
  }, 
  {
    name: "FordMustang",
    price: 35000000000000,
    image: "https://i.imgur.com/UsQG5Pz.jpg"
  }, 
  {
    name: "ToyotaChaser",
    price: 35000000000000,
    image: "https://i.imgur.com/93cqgWK.jpg"
  }, 
  {
    name: "LamborghiniAventador",
    price: 56000000000000,
    image: "https://i.imgur.com/cTCQeT9.jpg"
  }, 
  {
    name: "LamborghiniHuracan",
    price: 55000000000000,
    image: "https://i.imgur.com/AB1LFDH.jpg"
  }, 
  {
    name: "McLarenSenna",
    price: 50000000000000,
    image: "https://i.imgur.com/ipPRY73.jpg"
  }, 
  {
    name: "KoenigseggRegera",
    price: 57000000000000,
    image: "https://i.imgur.com/1YCg44x.jpg"
  },   
  {
    name: "Porsche911",
    price: 45000000000000,
    image: "https://i.imgur.com/2qqbiGN.jpg"
  },
  {
    name: "ChevroletCorvette",
    price: 48000000000000,
    image: "https://i.imgur.com/8NYSc0k.jpg"
  },
  {
    name: "AudiR8",
    price: 45000000000000,
    image: "https://i.imgur.com/6Zj0elf.jpg"
  },
  {
    name: "BMWM3",
    price: 42000000000000,
    image: "https://i.imgur.com/ra7mMtB.jpg"
  },
  {
    name: "MercedesBenzAMG",
    price: 45000000000000,
    image: "https://i.imgur.com/krHW2d6.jpg"
  },
  {
    name: "LexusLC500",
    price: 40000000000000,
    image: "https://i.imgur.com/SvNoF6g.jpg"
  },
  {
    name: "JaguarFType",
    price: 44000000000000,
    image: "https://i.imgur.com/yJKMfTx.jpg"
  },
  {
    name: "SubaruWRX",
    price: 37000000000000,
    image: "https://i.imgur.com/0s5P5n8.jpg"
  },
  {
    name: "MaseratiGranTurismo",
    price: 48000000000000,
    image: "https://i.imgur.com/ghQaE54.jpg"
  },
  {
    name: "AstonMartinVantage",
    price: 45000000000000,
    image: "https://i.imgur.com/ge1fXcZ.jpg"
  },  
  {
    name: "NissanGTR",
    price: 45000000000000,
    image: "https://i.imgur.com/RvQRoOB.jpg"
  },
  {
    name: "Evo10",
    price: 38000000000000,
    image: "https://i.imgur.com/53MWbCo.jpg"
  },  
  {
    name: "HondaCivicHatchback",
    price: 2800000000000,
    image: "https://i.imgur.com/mnRj4ME.jpg"
  }, 
  {
    name: "KoenigseggAbsolute",
    price: 53000000000000,
    image: "https://i.imgur.com/5B3aiRf.jpg"
  },
  {
    name: "MitsubishiGalant",
    price: 1000000000000,
    image: "https://i.imgur.com/Vm4dl0p.jpg"
  },
  {
    name: "MitsubishiLancer",
    price: 1500000000000,
    image: "https://i.imgur.com/vhvoOQV.jpg"
  },  
  {
    name: "NissanSentra",
    price: 1000000000000,
    image: "https://i.imgur.com/GNNlntP.jpg"
  },  
  {
    name: "ToyotaCorolla",
    price: 1000000000000,
    image: "https://i.imgur.com/iuh46Ms.jpg"
  },  
  {
    name: "MiniCooper",
    price: 500000000000,
    image: "https://i.imgur.com/aWHfJ0a.jpg"
  },
  {
    name: "Nissan350z",
    price: 35000000000000,
    image: "https://i.imgur.com/V8LlcuI.jpg"
  }, 
  {
    name: "PontiacGTO",
    price: 20000000000000,
    image: "https://i.imgur.com/0OQUaEx.jpg"
  },
  {
    name: "AMC-AMX",
    price: 15000000000000,
    image: "https://i.imgur.com/xlu8dTD.jpg"
  },
  {
    name: "ChevroletCamaro",
    price: 35000000000000,
    image: "https://i.imgur.com/Mb1aQD6.jpg"
  },
  {
    name: "PlymouthBarracuda",
    price: 27000000000000,
    image: "https://i.imgur.com/gKSDOaK.jpg"
  },
  {
    name: "LamborghiniSVJ",
    price: 58000000000000,
    image: "https://i.imgur.com/8YyRXsm.jpg"
  },
  {
    name: "BugattiLaVoitureNoire",
    price: 68000000000000,
    image: "https://i.imgur.com/yV9ckIP.jpg"
  },
  {
    name: "FerrariF40",
    price: 44000000000000,
    image: "https://i.imgur.com/FQ2AmHy.jpg"
  },
  {
    name: "PaganiZondaHP",
    price: 60000000000000,
    image: "https://i.imgur.com/2fkiYVB.jpg"
  },
  {
    name: "RollsRoyceSweptail",
    price: 58000000000000,
    image: "https://i.imgur.com/K86tVkR.jpg"
  },
  {
    name: "BugattiCentodieci",
    price: 57000000000000,
    image: "https://i.imgur.com/0zwJJvz.jpg"
  },
  {
    name: "MercedesMaybachExelero",
    price: 50000000000000,
    image: "https://i.imgur.com/Y6yeaK9.jpg"
  },
  {
    name: "PaganiHuayra ",
    price: 52000000000000,
    image: "https://i.imgur.com/UrfSklE.jpg"
  },
  {
    name: "BugattiDivo",
    price: 54000000000000,
    image: "https://i.imgur.com/PM93yJr.jpg"
  },
  {
    name: "BugattiBolide",
    price: 56000000000000,
    image: "https://i.imgur.com/mFCZOl3.jpg"
  },
  {
    name: "LamborghiniVenemo",
    price: 55000000000000,
    image: "https://i.imgur.com/UK8IGhR.jpg"
  },
  {
    name: "GordonMurray",
    price: 51000000000000,
    image: "https://i.imgur.com/dA1SE5D.jpg"
  },
  {
    name: "AsparkOw",
    price: 53000000000000,
    image: ""
  },
  {
    name: "McLarenSolus",
    price: 48000000000000,
    image: "https://i.imgur.com/UtBhspl.jpg"
  },
  {
    name: "MercedesAMGOne",
    price: 52000000000000,
    image: "https://i.imgur.com/VKfSgPS.jpg"
  },
  {
    name: "Aurelio",
    price: 32000000000000,
    image: "https://i.imgur.com/i0EOWkr.jpg"
  },
  {
    name: "LeylandMiniMarkIV",
    price: 500000000000,
    image: "https://i.imgur.com/BeLR6rm.jpg"
  },
  {
    name: "HondaCivicTyper",
    price: 39000000000000,
    image: "https://i.imgur.com/hwczmD2.jpg"
  },    
  {
    name: "SchoolBus",
    price: 18000000000000,
    image: "https://i.imgur.com/wnIAwfG.jpg"
  },    
  {
    name: "Jeep",
    price: 1500000000000,
    image: "https://i.imgur.com/US6zxoq.jpg"
  },
  {
    name: "RollsRoyceBoatTail",
    price: 70000000000000,
    image: "https://i.imgur.com/6nsyaff.jpg"
  },    
  {
    name: "LamborghiniCentenario",
    price: 54000000000000,
    image: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/few_off/Centenario/gallery/Lamborghini-Centenario-01.jpg"
  }, 
  {
    name: "KoenigseggJesko",
    price: 58500000000000,
    image: "https://i.imgur.com/kTGIs5H.jpg"
  },   
  {
    name: "LamborghiniTerzoMillennioConcept",
    price: 100000000000000,
    image: "https://i.imgur.com/qYnwcqF.jpg"
  },
];

const BUY_COOLDOWN_DURATION = 24 * 60 * 60 * 1000;
const UPGRADE_COOLDOWN_DURATION = 3 * 60 * 60 * 1000; 
const raceCooldowns = new Map();

let userCars = new Map();
function _0x367e(){const _0x4c8fb5=['725676mHiUUf','3924810RsLWpZ','683489PRckyk','3338937gEyHKY','5TlCUMe','1631268URQZxD','user_cars.json','18qyybJh','769710zeqThy','assetsPath','2MwIDxZ','993680blnuze','110nUNYkk'];_0x367e=function(){return _0x4c8fb5;};return _0x367e();}const _0x549a2e=_0x65eb;(function(_0x1b5a55,_0x50e9ed){const _0x30fbf0=_0x65eb,_0x272aed=_0x1b5a55();while(!![]){try{const _0x16ef29=parseInt(_0x30fbf0(0x15a))/0x1*(-parseInt(_0x30fbf0(0x162))/0x2)+parseInt(_0x30fbf0(0x165))/0x3+parseInt(_0x30fbf0(0x15d))/0x4*(-parseInt(_0x30fbf0(0x15c))/0x5)+parseInt(_0x30fbf0(0x166))/0x6+-parseInt(_0x30fbf0(0x15b))/0x7+parseInt(_0x30fbf0(0x163))/0x8*(parseInt(_0x30fbf0(0x15f))/0x9)+-parseInt(_0x30fbf0(0x160))/0xa*(-parseInt(_0x30fbf0(0x164))/0xb);if(_0x16ef29===_0x50e9ed)break;else _0x272aed['push'](_0x272aed['shift']());}catch(_0x581b29){_0x272aed['push'](_0x272aed['shift']());}}}(_0x367e,0x54704));function _0x65eb(_0x1376d6,_0x509971){const _0x367e0d=_0x367e();return _0x65eb=function(_0x65eb74,_0xfaa07e){_0x65eb74=_0x65eb74-0x15a;let _0x11db74=_0x367e0d[_0x65eb74];return _0x11db74;},_0x65eb(_0x1376d6,_0x509971);}const PATH=join(global[_0x549a2e(0x161)],_0x549a2e(0x15e));
function loadUserCars() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    userCars = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load user cars:', err);
  }
}


function saveUserCars() {
  try {
    const data = JSON.stringify([...userCars]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save user cars:', err);
  }
}

loadUserCars();

async function onCall({ message, getLang, args }) {
  if (!message || !message.body) {
    console.error('Invalid message object or message body!');
    return;
  }
  const { senderID } = message;
  const { Users } = global.controllers;



if (args.length === 0 || args[0] === "introduction") {
    const introductionMessage = getLang("car.introduction");
    const introductionImageURL = "https://i.imgur.com/Cve65Je.jpg"; 
    const introductionImageResponse = await axios.get(introductionImageURL, {
      responseType: "stream"
    });

    return message.reply({
      body: introductionMessage,
      attachment: introductionImageResponse.data
    });
  }

if (args[0] === "buy") {
  const carNameArg = args[1];
  const selectedCar = carData.find(car => car.name.toLowerCase() === carNameArg.toLowerCase());

  if (!selectedCar) {
    return message.reply("𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚌𝚊𝚛 𝚗𝚊𝚖𝚎.");
  }

  const userCurrentBalance = await Users.getMoney(senderID);

  if (userCurrentBalance < selectedCar.price) {
    return message.reply("『👨🏻‍💼』\n𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚋𝚞𝚢 𝚝𝚑𝚒𝚜 𝚌𝚊𝚛.");
  }

  const userCarList = userCars.get(senderID) || [];

  if (userCarList.length >= 4) {
    return message.reply("『👨🏻‍💼』\n𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚝𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚏 𝚌𝚊𝚛𝚜 𝚒𝚗 𝚢𝚘𝚞𝚛 𝚐𝚊𝚛𝚊𝚐𝚎.");
  }

  const lastPurchaseTime = userCarList.reduce((latestTime, car) => Math.max(latestTime, car.purchaseTime || 0), 0);
  const currentTime = Date.now();

  if (currentTime - lastPurchaseTime < BUY_COOLDOWN_DURATION) {
    const remainingCooldown = BUY_COOLDOWN_DURATION - (currentTime - lastPurchaseTime);
    const remainingCooldownHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
    const remainingCooldownMinutes = Math.ceil((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

    return message.reply(`『👨🏻‍💼』\n𝚈𝚘𝚞 𝚌𝚊𝚗 𝚋𝚞𝚢 𝚊𝚗𝚘𝚝𝚑𝚎𝚛 𝚌𝚊𝚛 𝚒𝚗 ${remainingCooldownHours} 𝚑𝚘𝚞𝚛𝚜 𝚊𝚗𝚍 ${remainingCooldownMinutes} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜.`);
  }

  const imageResponse = await axios.get(selectedCar.image, {
    responseType: "stream"
  });

  const newBalance = userCurrentBalance - selectedCar.price;

  if (!userCarList.some(car => car.name === selectedCar.name)) {
    userCarList.push({ name: selectedCar.name, price: selectedCar.price, purchaseTime: currentTime });
    userCars.set(senderID, userCarList);
    saveUserCars();
    await Users.decreaseMoney(senderID, selectedCar.price);

    const buySuccessMessage = getLang("car.buySuccess")
      .replace("{carName}", selectedCar.name)
      .replace("{carPrice}", selectedCar.price)
      .replace("{newBalance}", newBalance);

    return message.reply({
      body: buySuccessMessage,
      attachment: imageResponse.data
    });
  } else {
    return message.reply("『👨🏻‍💼』\n𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚠𝚗 𝚝𝚑𝚒𝚜 𝚌𝚊𝚛.");
  }
}

if (args[0] === "dragrace") {
  const userCarName = args[1];
  const betAmount = parseInt(args[2]);


  const cooldownTime = 5 * 60 * 1000; 
  const lastRaceTime = raceCooldowns.get(senderID) || 0;
  const timeSinceLastRace = Date.now() - lastRaceTime;

  if (timeSinceLastRace < cooldownTime) {
    const remainingCooldown = Math.ceil((cooldownTime - timeSinceLastRace) / 1000);
    return message.reply(`𝚈𝚘𝚞𝚛 𝚕𝚊𝚜𝚝 𝚛𝚊𝚌𝚎 𝚜𝚝𝚒𝚕𝚕 𝚌𝚕𝚎𝚊𝚗𝚒𝚗𝚐 𝚞𝚙. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 ${remainingCooldown} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜 𝚋𝚎𝚏𝚘𝚛𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚊𝚐𝚊𝚒𝚗`);
  }

  if (!userCarName || isNaN(betAmount) || betAmount < 1000000000000) {
    return message.reply("𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚒𝚗𝚙𝚞𝚝. 𝙼𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚏𝚘𝚛 𝚍𝚛𝚊𝚐 𝚛𝚊𝚌𝚎 𝚒𝚜 1,000,000,000,000.");
  }

  const userCar = userCars.get(senderID).find(car => car.name.toLowerCase() === userCarName.toLowerCase());

  if (!userCar) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚝𝚑𝚎 𝚜𝚙𝚎𝚌𝚒𝚏𝚒𝚎𝚍 𝚌𝚊𝚛.");
  }

  const userCurrentBalance = await Users.getMoney(senderID);

  if (userCurrentBalance < betAmount) {
    return message.reply("𝙸𝚗𝚜𝚞𝚏𝚏𝚒𝚌𝚒𝚎𝚗𝚝 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚎 𝚋𝚎𝚝.");
  }


  const dragRaceCars = carData.concat(carData);

  const opponentCars = dragRaceCars.filter(car => car.name !== userCar.name);
  const opponentCar = opponentCars[Math.floor(Math.random() * opponentCars.length)]; 


  const userTime = 8 + Math.random() * 2;
  const opponentTime = 8 + Math.random() * 2;


  const userWins = userTime < opponentTime;
  const isTie = userTime === opponentTime;


  let resultMessage = '';

  if (isTie) {

    resultMessage = `𝐃𝐫𝐚𝐠 𝐑𝐚𝐜𝐞 𝐑𝐞𝐬𝐮𝐥𝐭 🏁:\nIt's a tie! Both ${userCar.name} and ${opponentCar.name} finished in ${userTime.toFixed(2)} seconds.\n\n𝙽𝚘 𝚠𝚒𝚗𝚗𝚎𝚛𝚜 𝚘𝚛 𝚕𝚘𝚜𝚎𝚛𝚜, 𝚝𝚑𝚎 𝚋𝚎𝚝 𝚛𝚎𝚖𝚊𝚒𝚗𝚜 𝚞𝚗𝚌𝚑𝚊𝚗𝚐𝚎𝚍.`;
  } else if (userWins) {

    resultMessage = `𝐃𝐫𝐚𝐠 𝐑𝐚𝐜𝐞 𝐑𝐞𝐬𝐮𝐥𝐭 🏁:\n𝚈𝚘𝚞𝚛 ${userCar.name} 𝚏𝚒𝚗𝚒𝚜𝚑𝚎𝚍 𝚒𝚗 ${userTime.toFixed(2)} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜!\n𝙾𝚙𝚙𝚘𝚗𝚎𝚗𝚝'𝚜 ${opponentCar.name} 𝚏𝚒𝚗𝚒𝚜𝚑𝚎𝚍 𝚒𝚗 ${opponentTime.toFixed(2)} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜!\n\n𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬, 𝚢𝚘𝚞'𝚟𝚎 𝚠𝚘𝚗 $${betAmount}! 💰`;
    await Users.increaseMoney(senderID, betAmount);
  } else {

    resultMessage = `𝐃𝐫𝐚𝐠 𝐑𝐚𝐜𝐞 𝐑𝐞𝐬𝐮𝐥𝐭 🏁:\n𝚈𝚘𝚞𝚛 ${userCar.name} 𝚏𝚒𝚗𝚒𝚜𝚑𝚎𝚍 𝚒𝚗 ${userTime.toFixed(2)} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜!\n𝙾𝚙𝚙𝚘𝚗𝚎𝚗𝚝'𝚜 ${opponentCar.name} 𝚏𝚒𝚗𝚒𝚜𝚑𝚎𝚍 𝚒𝚗 ${opponentTime.toFixed(2)} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜!\n\n𝚄𝚗𝚏𝚘𝚛𝚝𝚞𝚗𝚊𝚝𝚎𝚕𝚢, 𝚢𝚘𝚞'𝚛𝚎 𝚕𝚘𝚜𝚝 $${betAmount}. 💸`;
    await Users.decreaseMoney(senderID, betAmount);
  }

  const userCarInfo = dragRaceCars.find(car => car.name === userCar.name);
  const opponentCarInfo = dragRaceCars.find(car => car.name === opponentCar.name);

  const attachmentStreams = [];
  const userCarImageResponse = await axios.get(userCarInfo.image, {
    responseType: "stream"
  });
  const opponentCarImageResponse = await axios.get(opponentCarInfo.image, {
    responseType: "stream"
  });

  attachmentStreams.push(userCarImageResponse.data);
  attachmentStreams.push(opponentCarImageResponse.data);

  const delayDuration = 7000; 
  const delayGifURL = "https://media.tenor.com/23Hso_j4PP0AAAAd/mexicandriver-drag-race.gif"; 


  const gifMessage = await message.reply({
    body: "𝚁𝚊𝚌𝚎 𝚒𝚜 𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐... 🏁",
    attachment: (await axios.get(delayGifURL, { responseType: "stream" })).data
  });


  await new Promise(resolve => setTimeout(resolve, delayDuration));


  if (global.api && global.api.unsendMessage) {
    await global.api.unsendMessage(gifMessage.messageID);
  }
  raceCooldowns.set(senderID, Date.now());

  return message.reply({
    body: resultMessage,
    attachment: attachmentStreams
  });
}

if (args[0] === "available") {

  const sortedCars = carData.sort((carA, carB) => carB.price - carA.price);


  const availableCarsMessage = "𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄 𝐂𝐀𝐑𝐒:\n\n" +
    sortedCars.map(car => `• ${car.name} - $${car.price.toLocaleString()}\n━━━━━━━━━━━━━`).join("\n");

  return message.reply(availableCarsMessage);
}  

if (args[0] === "upgrade") {
  const userCarName = args[1];
  const userCarList = userCars.get(senderID) || [];
  const userCar = userCarList.find(car => car.name.toLowerCase() === userCarName.toLowerCase());

  let carInfo;

  if (userCar) {
    carInfo = carData.find(dataCar => dataCar.name === userCar.name) || carData.find(dataCar => dataCar.name === userCar.name);
  } else {
    carInfo = carData.find(dataCar => dataCar.name.toLowerCase() === userCarName.toLowerCase()) || carData.find(dataCar => dataCar.name.toLowerCase() === userCarName.toLowerCase());
  }

  if (!carInfo) {
    return message.reply("『👨🏻‍🔧』\nYou don't own a car with that name.");
  }

  const currentTime = Date.now();
  const lastUpgradeTime = userCar?.lastUpgradeTime || 0;

  if (currentTime - lastUpgradeTime < UPGRADE_COOLDOWN_DURATION) {
    const remainingCooldown = UPGRADE_COOLDOWN_DURATION - (currentTime - lastUpgradeTime);
    const remainingCooldownHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
    const remainingCooldownMinutes = Math.ceil((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

    return message.reply(`『👨🏻‍🔧』\nYou can upgrade your car again in ${remainingCooldownHours} hours and ${remainingCooldownMinutes} minutes.`);
  }

  const upgradeCost = 1000000000; 
  const userCurrentBalance = await Users.getMoney(senderID);

  if (userCurrentBalance < upgradeCost) {
    return message.reply("『👨🏻‍🔧』\nInsufficient funds to upgrade your car.");
  }


  await Users.decreaseMoney(senderID, upgradeCost);


  for (const userCar of userCarList) {
    userCar.price += upgradeCost;
    userCar.lastUpgradeTime = currentTime;
    userCar.upgradeCount = (userCar.upgradeCount || 0) + 1;
  }

  saveUserCars();

  const upgradedPrice = carInfo.price + userCar.upgradeCount * 1000000000;

  const upgradeMessage = `『👨🏻‍🔧』\nYou've upgraded your ${carInfo.name}!\n━━━━━━━━━━━━━\n` +
    `Number of Upgrades: ${userCar.upgradeCount}\n` +
    `New Price: $${upgradedPrice.toLocaleString()} 💵\n` +
    `Upgrade Cost: $${upgradeCost.toLocaleString()} 💵`;

  const imageResponse = await axios.get(carInfo.image, {
    responseType: "stream"
  });

  return message.reply({
    body: upgradeMessage,
    attachment: imageResponse.data
  });
}

if (args[0] === "upgradeall") {
  const userCarList = userCars.get(senderID) || [];

  if (userCarList.length === 0) {
    return message.reply("『👨🏻‍🔧』\nYou don't own any cars to upgrade.");
  }

  const currentTime = Date.now();
  const lastUpgradeTime = userCarList[0]?.lastUpgradeTime || 0;

  if (currentTime - lastUpgradeTime < UPGRADE_COOLDOWN_DURATION) {
    const remainingCooldown = UPGRADE_COOLDOWN_DURATION - (currentTime - lastUpgradeTime);
    const remainingCooldownHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
    const remainingCooldownMinutes = Math.ceil((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

    return message.reply(`『👨🏻‍🔧』\nYou can upgrade your cars again in ${remainingCooldownHours} hours and ${remainingCooldownMinutes} minutes.`);
  }

  const upgradeCost = 1000000000; 
  const userCurrentBalance = await Users.getMoney(senderID);

  if (userCurrentBalance < upgradeCost * userCarList.length) {
    return message.reply("『👨🏻‍🔧』\nInsufficient funds to upgrade all your cars.");
  }

  const attachmentStreams = [];
  const upgradeMessages = [];


  for (const userCar of userCarList) {
    userCar.price += upgradeCost;
    userCar.lastUpgradeTime = currentTime;
    userCar.upgradeCount = (userCar.upgradeCount || 0) + 1;

    const carInfo = carData.find(dataCar => dataCar.name === userCar.name) || carData.find(dataCar => dataCar.name === userCar.name);

    if (carInfo) {
      const upgrades = userCar.upgradeCount || 0;
      const upgradedPrice = carInfo.price + upgrades * 1000000000; 

      upgradeMessages.push(
        `⇒ ${carInfo.name} \n$${carInfo.price.toLocaleString()} 💵 \nNumber of Upgrades: ${upgrades} \nUpgraded Price: $${upgradedPrice.toLocaleString()} 💵\n━━━━━━━━━━━━━`
      );

      const imageResponse = await axios.get(carInfo.image, {
        responseType: "stream"
      });
      attachmentStreams.push(imageResponse.data);
    }
  }


  await Users.decreaseMoney(senderID, upgradeCost * userCarList.length);

  saveUserCars();


  return message.reply({
    body: upgradeMessages.join("\n"),
    attachment: attachmentStreams
  });
}

if (args[0] === "sell") {
  const carNameArg = args[1];

  if (!carNameArg) {
    return message.reply("『👨🏻‍💼』\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚝𝚑𝚎 𝚗𝚊𝚖𝚎 𝚘𝚏 𝚝𝚑𝚎 𝚌𝚊𝚛 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚕𝚕.");
  }

  const userCarList = userCars.get(senderID) || [];
  const selectedCar = userCarList.find(userCar => userCar.name.toLowerCase() === carNameArg.toLowerCase());

  let carInfo;

  if (selectedCar) {
    carInfo = carData.find(dataCar => dataCar.name === selectedCar.name) || carData.find(dataCar => dataCar.name === selectedCar.name);
  } else {
    carInfo = carData.find(dataCar => dataCar.name.toLowerCase() === carNameArg.toLowerCase()) || carData.find(dataCar => dataCar.name.toLowerCase() === carNameArg.toLowerCase());
  }

  if (!carInfo) {
    return message.reply("『👨🏻‍💼』\n𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚌𝚊𝚛 𝚠𝚒𝚝𝚑 𝚝𝚑𝚊𝚝 𝚗𝚊𝚖𝚎.");
  }


  const upgrades = selectedCar?.upgradeCount || 0;
  const sellingPrice = carInfo.price + upgrades * 1000000000;

  await Users.increaseMoney(senderID, sellingPrice);

  const updatedUserCarList = userCarList.filter(userCar => userCar.name !== selectedCar.name);
  userCars.set(senderID, updatedUserCarList);
  saveUserCars();

  return message.reply(`『👨🏻‍💼』\n𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚘𝚕𝚍 ${selectedCar.name} 𝚊𝚗𝚍 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 $${sellingPrice} 💵.`);
}

if (args[0] === "inventory") {
  if (!userCars.has(senderID) || userCars.get(senderID).length === 0) {
    return message.reply("『👨🏻‍🔧』\n𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊𝚗𝚢 𝚌𝚊𝚛𝚜 𝚒𝚗 𝚢𝚘𝚞𝚛 𝚐𝚊𝚛𝚊𝚐𝚎.");
  }

  const userCarList = userCars.get(senderID);
  const attachmentStreams = [];
  const inventoryMessages = [];

  for (const userCar of userCarList) {
    const carInfo = carData.find(dataCar => dataCar.name === userCar.name) || carData.find(dataCar => dataCar.name === userCar.name);

    if (carInfo) {
      const upgrades = userCar.upgradeCount || 0;
      const upgradedPrice = carInfo.price + upgrades * 1000000000; 

      inventoryMessages.push(
        `⇒ ${carInfo.name} \n$${carInfo.price.toLocaleString()} 💵 \n𝚄𝚙𝚐𝚛𝚊𝚍𝚎𝚜: ${upgrades} \n𝚄𝚙𝚐𝚛𝚊𝚍𝚎𝚍 𝙿𝚛𝚒𝚌𝚎: $${upgradedPrice.toLocaleString()} 💵\n━━━━━━━━━━━━━`
      );

      const imageResponse = await axios.get(carInfo.image, {
        responseType: "stream"
      });
      attachmentStreams.push(imageResponse.data);
    }
  }


  await message.reply({
    body: inventoryMessages.join("\n"),
    attachment: attachmentStreams
  });

  return; 
}

if (args[0] === "check") {
  const carNameArg = args[1];

  if (!carNameArg) {
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚝𝚑𝚎 𝚗𝚊𝚖𝚎 𝚘𝚏 𝚝𝚑𝚎 𝚌𝚊𝚛 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚌𝚑𝚎𝚌𝚔.");
  }

  const userCarList = userCars.get(senderID) || [];
  const selectedCar = userCarList.find(userCar => userCar.name.toLowerCase() === carNameArg.toLowerCase());

  if (!selectedCar) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚝𝚑𝚒𝚜 𝚌𝚊𝚛.");
  }

  const carInfo = carData.find(dataCar => dataCar.name === selectedCar.name) || carData.find(dataCar => dataCar.name === selectedCar.name);

  if (!carInfo) {
    return message.reply("𝙲𝚊𝚛 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍.");
  }

  const upgrades = selectedCar.upgradeCount || 0;
  const upgradedPrice = carInfo.price + upgrades * 1000000000; 

  const checkMessage = `𝙲𝚊𝚛 𝙽𝚊𝚖𝚎: ${carInfo.name}\n𝙾𝚛𝚒𝚐𝚒𝚗𝚊𝚕 𝙿𝚛𝚒𝚌𝚎: $${carInfo.price.toLocaleString()} 💵\n𝚄𝚙𝚐𝚛𝚊𝚍𝚎𝚜: ${upgrades}\n𝚄𝚙𝚐𝚛𝚊𝚍𝚎𝚍 𝙿𝚛𝚒𝚌𝚎: $${upgradedPrice.toLocaleString()} 💵`;

  const imageResponse = await axios.get(carInfo.image, {
    responseType: "stream"
  });

  return message.reply({
    body: checkMessage,
    attachment: imageResponse.data
  });
}

if (args[0] === "transfer") {
    const targetUserID = args[1];
    const carNameArg = args.slice(2).join(" ");

    if (!targetUserID || !carNameArg) {
      return message.reply("Please provide a valid target user ID and the name of the car you want to transfer.");
    }


    loadUserCars();

    const senderCarList = userCars.get(senderID) || [];
    const targetCarList = userCars.get(targetUserID) || [];



    const selectedCarIndex = senderCarList.findIndex(userCar => userCar.name.toLowerCase() === carNameArg.toLowerCase());

    if (selectedCarIndex === -1) {
      return message.reply("You don't own this car.");
    }

    const selectedCar = senderCarList[selectedCarIndex];

    if (targetCarList.length >= 4) {
      return message.reply("『👨🏻‍💼』\nThe target user already has the maximum number of cars in their garage.");
    }

    if (senderID === targetUserID) {
      return message.reply("『👨🏻‍💼』\nYou cannot transfer a car to yourself.");
    }


    if (targetCarList.some(userCar => userCar.name.toLowerCase() === carNameArg.toLowerCase())) {
      return message.reply(`『👨🏻‍💼』\nTarget user already owns the ${carNameArg}.`);
    }


    const transferCost = 250000000000;

    if (await Users.getMoney(senderID) < transferCost) {
      return message.reply("『👨🏻‍💼』\nYou don't have enough money to cover the transfer cost.");
    }


    senderCarList.splice(selectedCarIndex, 1);
    targetCarList.push(selectedCar);

    userCars.set(senderID, senderCarList);
    userCars.set(targetUserID, targetCarList);

    saveUserCars();


    await Users.decreaseMoney(senderID, transferCost);
    await Users.decreaseMoney(targetUserID, transferCost);

    return message.reply(`『👨🏻‍💼』\nYou have successfully transferred your ${carNameArg} to your target user. Both you and the target have been charged $ ${transferCost.toLocaleString()} for the transfer.`);
  }

const introductionMessage = getLang("car.introduction");
const introductionImageURL = "https://i.imgur.com/Cve65Je.jpg"; 
const introductionImageResponse = await axios.get(introductionImageURL, {
  responseType: "stream"
});

return message.reply({
  body: introductionMessage,
  attachment: introductionImageResponse.data
});
}


export default {
  config,
  langData,
  onCall
};