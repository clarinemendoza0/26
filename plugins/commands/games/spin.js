import axios from 'axios';
const config = {
  name: "spin",
  aliases: ["s"],
  description: "Làm giàu bằng nhân phẩm",
  usage: "<none>",
  cooldown: 10,
  permissions: [0, 1, 2],
  credits: 'WaifuCat (Modified by: Rue)',
  extra: {}
};

async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
const spin = (await axios.get("https://i.imgur.com/8AtFAHI.png", {
    responseType: "stream"
  })).data;
  try {
    const targetID = message.senderID;
    const randomAmount = Math.floor(Math.random() * 999999);
    const totalAmount = randomAmount;

    let replyMessage = `🎰 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! You won: ${totalAmount.toLocaleString()} cash 💰`;

    message.reply({
      body: replyMessage,
      attachment: spin});;

    await Users.increaseMoney(targetID, totalAmount);
  } catch (error) {
    console.error(error);
    message.reply('Đã xảy ra lỗi!');
  }
}

export default {
  config,
  onCall,
};