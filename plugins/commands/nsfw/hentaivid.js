import axios from 'axios';

const config = {
  name: "hentaivid",
  aliases: ["henvid"],
  permission: [0, 1, 2],
  version: "1.0",
  author: "MILAN",
  credits: "Grim",
  cooldown: 5,
  description: "hentai videos",
  nsfw: true
};

async function onCall({ message }) {
    const BASE_URL = `https://milanbhandari.imageapi.repl.co/hentai?apikey=xyzmilan`;
    await message.reply("Processing your video please wait...");
    try {
      let res = await axios.get(BASE_URL)
      let vid = res.data.url;
      const form = {
        body: ``
      };
      if (vid)
        form.attachment = await global.getStream(vid);
      message.reply(form);
    } catch (e) {
      message.reply(`Something went wrong. Please try again later`)
      console.log(e);
    }
};

export default {
  config,
  onCall
};