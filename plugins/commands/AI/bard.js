import axios from 'axios';
const config = {
  name: "bard",
  aliases: ["chat","ai","ask"],
  description: "Bulu is just a bard, I understand it's not worth it, ahhihihihiihihihi",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Eien Mojiki f/. Mirai // ndt22w",
  extra: {}
};
const onCall = async ({ message, args }) => {
  const input = args.join(" ")
 try {
    const waitMessage = await message.reply(`Answering your question. Please wait a moment:\n${(input)}`);
    const res = await axios.get(`https://oki.lon99999999.repl.co/bard?ask=${encodeURIComponent(input)}`);
    const chat = res.data.result;
    await message.reply(`${chat}`);
    await waitMessage.unsend();
    } catch (error) {
    console.error(error);
    await message.reply("There is a problem that occurred in your request.");
  }
}

export default {
  config,
  onCall
};
