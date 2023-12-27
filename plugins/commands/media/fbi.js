const config = {
  name: "fbi",
  aliases: [".", "."],
  description: `random meme`,
  version: "0.0.2-beta-update",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: ` 
    Huynh Le Tan Phat`
}

const images = [
  "https://i.imgur.com/kgaxamI.jpg",
  "https://i.imgur.com/2No4JeO.jpg",
  "https://i.imgur.com/bSU25Lw.jpg",
  "https:////i.imgur.com/C36qNvO.jpg",
  "https:////imgur.com/YaGuxaO.jpg",
  "https://imgur.com/GHWhKfD.jpg",
  "https://i.imgur.com/YHGd7Kf.jpg",
  "https://i.imgur.com/bPsO3ex.jpg",
  "https://i.imgur.com/6C3Feu3.jpg",
  "https://i.imgur.com/8rgfpMI.jpg",
  "https://i.imgur.com/HyjxRMz.jpg",
  "https://i.imgur.com/NIVJ3IB.jpg",
  "https://i.imgur.com/DxMp0rV.jpg",
  "https://i.imgur.com/tG7reGS.jpg",
  "https://i.imgur.com/qVlC1C9.jpg",
  "https://i.imgur.com/5SZsVCb.jpg",
  "https://i.imgur.com/715G04S.jpg",
  "https://i.imgur.com/7vgNrZZ.jpg",
  "https://i.imgur.com/53OZTNo.jpg",
  "https://i.imgur.com/rUp3Itu.jpg",
  "https://i.imgur.com/wLlBvuP.jpg",
  "https://i.imgur.com/hYcw2O6.jpg",
  "https://i.imgur.com/c8Hbimv.jpg",
  "https://i.imgur.com/TbxdXxK.jpg",
  "https://i.imgur.com/bKmBUBi.jpg",
  "https://i.imgur.com/Dg5rl1n.jpg",
  "https://i.imgur.com/RexDSSB.jpg",
  "https://i.imgur.com/K7n0nfU.jpg",
  "https://i.imgur.com/Z4LhyD7.jpg",
  "https://i.imgur.com/YFQaqyy.jpg",
  "https://i.imgur.com/i5ivFPV.jpg",
  "https://i.imgur.com/SMHfj5F.jpg",
  "https://i.imgur.com/dNpwIUJ.jpg",
  "https://i.imgur.com/R7oo02J.jpg",
  "https://i.imgur.com/b2UR9cG.jpg",
  "https://i.imgur.com/ZXbSgTy.jpg",
  "https://i.imgur.com/DdSNwI6.jpg",
  "https://i.imgur.com/aad9TSY.jpg",
  "https://i.imgur.com/zFi11Na.jpg",
  "https://i.imgur.com/ian8WEK.jpg",
  "https://i.imgur.com/StBvv3L.jpg",
  "https://i.imgur.com/systYku.jpg",
  "https://i.imgur.com/pLh8mZb.jpg",
  "https://i.imgur.com/CbtYXK2.jpg",
  "https://i.imgur.com/0mqCEkB.jpg",
  "https://i.imgur.com/IfGDjaC.jpg",
  "https://i.imgur.com/st0ADoh.jpg",
  "https://i.imgur.com/R75NmUZ.jpg",
  "https://i.imgur.com/S16XTVx.jpg",
]

async function onCall({ message }) {
  try {
    if (images.length == 0) return message.reply(getLang("error"));

    const index = Math.floor(Math.random() * images.length);
    const image = images[index];

    const imageStream = await global.getStream(image);
    await message.reply({
      attachment: [imageStream]
    });
  } catch (e) {
    message.reply(getLang("error"));
  }

  return;
}


export default {
  config,
  onCall
}