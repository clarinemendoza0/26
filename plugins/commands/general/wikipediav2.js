import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
  name: 'wikipedia2',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn(Converted by Rue)',
  description: 'Get Wikipedia information using the Wikipedia API.',
  usages: '[page_title]',
  cooldown: 5,
};

async function onCall({ message, args }) {
  try {
    const pageTitle = encodeURIComponent(args.join(' '));

    if (!pageTitle) {
      return message.reply('Kindly provide a page title.',);
    }

    const processingMessage = await message.reply('Processing, please wait...',);

    const response = await axios.get(`https://wikipedia2.august-api.repl.co/wiki/${pageTitle}`);
    const { title, extract, imageUrl, url, pageId, lastRevision, lastRevisionId } = response.data;

    await global.api.unsendMessage(processingMessage.messageID);

    if (!extract) {
      return message.reply(`No information found for "${args.join(' ')}".`,);
    }

    let pathImg = path.join(global.cachePath, 'wikipedia_image.jpg')
    let hasError = false;

    try {
      let imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(imageResponse.data, "binary"));
    } catch (error) {
      console.error('Error fetching Wikipedia image:', error);
      hasError = true;
    }

    const messages = `📖 Wikipedia Information for "${title}"\n𝗧𝗜𝗧𝗟𝗘: ${title}\n𝗖𝗢𝗡𝗧𝗘𝗡𝗧: ${extract || 'N/A'}\n𝗜𝗠𝗔𝗚𝗘 𝗨𝗥𝗟: ${imageUrl || 'N/A'}\n𝗨𝗥𝗟: ${url || 'N/A'}\n𝗣𝗔𝗚𝗘 𝗜𝗗: ${pageId || 'N/A'}\n𝗟𝗔𝗦𝗧 𝗥𝗘𝗩𝗜𝗦𝗜𝗢𝗡: ${lastRevision || 'N/A'}\n𝗟𝗔𝗦𝗧 𝗥𝗘𝗩𝗜𝗦𝗜𝗢𝗡 𝗜𝗗: ${lastRevisionId || 'N/A'}`;

    if (!hasError) {
      return message.reply(
        { body: messages, attachment: fs.createReadStream(pathImg) }
      );
    } else {
      return message.reply(
        { body: messages }
      );
    }
  } catch (error) {
    console.error('Error fetching Wikipedia information:', error);
    return message.reply('An error occurred while fetching Wikipedia information.');
  }
};

export default {
  config,
  onCall
}