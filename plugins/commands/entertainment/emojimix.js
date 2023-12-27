import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const config = {
    name: "emojimix",
    aliases: ['emojix'],
    version: "1.0",
    credits: "Grim",
    description: "Mix two emojis into an image.",
    usages: "[emoji-1] + [emoji-2]",
    cooldown: 10,
};

async function onCall({ args, message }) {
    try {
        const input = args.join(' ');

        // Split the input at the "|" character
        const [emoji1, emoji2] = input.split('+').map(e => e.trim());

        if (!emoji1 || !emoji2) {
            return message.reply("🤓 | Please provide two emojis to mix in the format: emoji1 + emoji2");
        }

        message.react("⏳");
        const apiUrl = `https://api.siam-emojimix.repl.co/convert?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
            return message.reply("⚠️ | Can't be mixed!");
        }

        const data = response.data;

        if (!data.imageUrl) {
            return message.reply("❌ | An error occurred while fetching the image URL.");
        }

        const imageUrl = data.imageUrl;
     
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        const uniqueFileName = path.join(
            global.cachePath,
            `${uuidv4()}_mixed_emoji.png`
        );

        fs.writeFileSync(uniqueFileName, imageBuffer);

        await message.react("✅");
        message.reply({
            body: "✨ | Mixed Emoji:",
            attachment: fs.createReadStream(uniqueFileName),
        }, message.threadID, () => fs.unlinkSync(uniqueFileName));
    } catch (error) {
        console.error(error);
        message.reply("⚠️ | Can't be mixed!");
    }
}

export default {
    config,
    onCall
};