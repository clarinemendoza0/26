  
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
 
export const config = {
  name: "wallp",
  aliases: [],
  credits: "kshitiz converted by Ariél Violét",
  version: "2.0",
  cooldown: 5,
  description: "Search for wallpapers based on a keyword.",
  usage: "{p}ws <keyword> [amount]\nExample: {p}ws nature 3",
};
 
export const onCall = async ({ api, message, args }) => {
  if (args.length < 1) {
    message.reply('Please provide a keyword for the wallpaper search.');
    return;
  }
 
  const keyword = args[0];
  let amount = args[1] || 1;
 
  amount = parseInt(amount);
  if (isNaN(amount) || amount <= 0) {
    message.reply('Please provide a valid positive integer for the amount.');
    return;
  }
 
  try {
    const response = await axios.get(`https://antr4x.onrender.com/get/searchwallpaper?keyword=${keyword}`);
 
    if (response.data.status && response.data.img.length > 0) {
      amount = Math.min(amount, response.data.img.length);
 
      const imgData = [];
      for (let i = 0; i < amount; i++) {
        const image = response.data.img[i];
        const imageName = `wallpaper_${i + 1}.jpg`;
        const imagePath = path.join('cache', imageName);
 
        try {
          const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
          await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
          imgData.push(imagePath);
        } catch (error) {
          console.error("Error downloading image:", error);
        }
      }
 
      message.reply({
        attachment: imgData.map(imgPath => fs.createReadStream(imgPath)),
        body: `Wallpapers based on '${keyword}' 🌟`,
      }, (err) => {
        if (err) console.error("Error sending images:", err);
 
        imgData.forEach(imgPath => {
          fs.unlinkSync(imgPath);
        });
      });
    } else {
      message.reply('No wallpapers found for the given keyword.');
    }
  } catch (error) {
    console.error('Error fetching wallpaper images:', error);
    message.reply('An error occurred while fetching wallpaper images.');
  }
};