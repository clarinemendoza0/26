import axios from 'axios';

const config = {
  name: "imgur",
  version: "1.0",
  credits: "Rishad",
  cooldown: 5,
  hasPermission: 0,
  description: "Upload image or video to Imgur by replying to photo or video",
  usages: "[image, video]"
};

async function onCall({ message }) {
    const link = message.messageReply?.attachments[0]?.url;
    if (!link) {
      return message.reply('Please reply to an image or video.',);
    }

    try {
      const res = await axios.get(`https://rishadapi.rishad100.repl.co/imgur2?apikey=fuck&link=${encodeURIComponent(link)}`);
      const uploaded = res.data.uploaded;

      if (uploaded.status === "success") {
        return message.reply(uploaded.url);
      } else {
        return message.reply('Failed to upload image or video to Imgur.');
      }
    } catch (error) {
      console.error(error);
      return message.reply('Failed to upload image or video to Imgur.');
    }
  };

export default {
  config,
  onCall
}