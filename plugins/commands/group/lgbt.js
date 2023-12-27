const config = {
  "name": "lgbt",
  "description": "Random ảnh lgbt",
  "usage": "",
  "cooldown": 5,
  "permissions": [ 0 ],
  "credits": "Waifu Cat",

}

const images = [
"https://imgur.com/sUcNg7y.jpg",
"https://imgur.com/DhuTZ8D.jpg",
"https://imgur.com/Ce3Yiq7.jpg",
"https://imgur.com/QbpCjIQ.jpg",
"https://imgur.com/rIQJj49.jpg",
"https://imgur.com/DZhVI2l.jpg",
"https://imgur.com/cRd3r4Y.jpg",
"https://imgur.com/zyGz7Mb.jpg",
"https://imgur.com/TBqijhR.jpg",
"https://imgur.com/JlCnAR9.jpg",
"https://imgur.com/YeySrLr.jpg",
"https://imgur.com/fTRfk1Y.jpg",
"https://imgur.com/2Ge4lR5.jpg",
"https://imgur.com/lrkU6jI.jpg",
"https://imgur.com/2BTyJiU.jpg",
"https://imgur.com/Jy6zeiC.jpg",
"https://imgur.com/vVsL5tR.jpg",
"https://imgur.com/01qGsMj.jpg",
"https://imgur.com/r4ZqryE.jpg",
"https://imgur.com/eZvYKX2.jpg",
"https://imgur.com/51VnhJG.jpg",
"https://imgur.com/eMcWYfe.jpg",
"https://imgur.com/2itdAYV.jpg",
"https://imgur.com/l1H1Qz9.jpg",
"https://imgur.com/HRIw6y5.jpg",
"https://imgur.com/gPddGRX.jpg",
"https://imgur.com/Z4TDGm3.jpg",
"https://imgur.com/oDh32Xs.jpg",
"https://imgur.com/6pQeTXF.jpg",
"https://imgur.com/a36bjFW.jpg",
"https://imgur.com/OLSwbvH.jpg",
"https://imgur.com/kdiCF0g.jpg",
"https://imgur.com/mLSNwJQ.jpg",
"https://imgur.com/0COvHi7.jpg",
"https://imgur.com/90Bu7xf.jpg",
"https://imgur.com/c16i7ml.jpg",
"https://imgur.com/ioITZbD.jpg",
"https://imgur.com/9Al7enT.jpg",
"https://imgur.com/MSo6KC9.jpg",
"https://imgur.com/5ZbZgz0.jpg",
"https://imgur.com/1KYya0d.jpg",
"https://imgur.com/upAW4Â.jpg",
"https://imgur.com/YYuZQ2Q.jpg",
"https://imgur.com/cP83w6C.jpg",
"https://imgur.com/uXqUSoZ.jpg",
"https://imgur.com/nikzgS7.jpg",
"https://imgur.com/TC9E646.jpg",
"https://imgur.com/dNfnn3T.jpg",
"https://imgur.com/y2WsmUb.jpg",
"https://imgur.com/4h8hwsk.jpg",
  ];

async function onCall({ message}) {
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