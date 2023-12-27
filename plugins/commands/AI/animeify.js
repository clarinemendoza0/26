import axios from 'axios';

const config = {
    name: "animeify",
    description: "Convert Image to Anime Image",
    usage: "[reply/image_url]",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Isai && TakiUwW"
}


export async function onCall({ message, args }) {
    try {
        let imageUrl = '';
        if (message.type === 'message_reply') {
            if (message.messageReply.attachments.length > 0) {
                let attachment = message.messageReply.attachments[0];
                if (attachment.type === 'photo' || attachment.type === 'sticker') {
                    imageUrl = attachment.url;
                } else {
                    return message.reply("Invalid attachment type. Please reply with a photo or sticker.");
                }
            } else {
                return message.reply("No attachment found. Please reply with a photo or sticker.");
            }
        } else if (args.length > 0) {
            imageUrl = args[0];
        } else {
            return message.reply("Please provide an image URL or reply with a photo or sticker.");
        }
        await message.reply("Request received, Please wait a moment...")

        const type = args.length > 1 ? args[1] : 1;
        const res = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);

        const image = res.data.urls[0];
        const imageSingle = res.data.urls[1];
        let imgStream = await global.getStream(`https://www.drawever.com${image}`);
        let img = await global.getStream(`https://www.drawever.com${imageSingle}`)

        message.reply({
            body: `Here's the converted image:\n\nLinks:\nhttps://www.drawever.com${image}\nhttps://www.drawever.com${imageSingle}`,
            attachment: [imgStream, img]        
        });
    } catch (err) {
        console.error(err);
        return message.reply("An error occured while processing the image, make sure your image has real human faces.");
    }
}

export default {
    config,
    onCall
}