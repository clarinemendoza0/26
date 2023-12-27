import axios from 'axios';

const config = {
  name: "tempmail",
  aliases: ["tm"],
  version: "1.0",
  permissions: [0, 1, 3],
  usage: "| inbox [tempmail]",
  cooldown: 5,
  author: "kshitiz",
  credits: "Grim",
  description: "Create temporary mail.",
};

const TEMP_MAIL_URL = 'https://tempmail-api.codersensui.repl.co/api/gen';

async function onCall({  message, args }) {
  try {
    if (args[0] === 'inbox') {
      if (!args[1]) {
        return message.reply("❌ Please provide an email address for the inbox.");
      }

      const emailAddress = args[1];
      const inboxResponse = await axios.get(`https://tempmail-api.codersensui.repl.co/api/getmessage/${emailAddress}`);
      const messages = inboxResponse.data.messages;

      if (!messages || messages.length === 0) {
        return message.reply(`No messages found for ${emailAddress}.`);
      }

      let messageText = '📬 Inbox Messages: 📬\n\n';
      for (const message of messages) {
        messageText += `📩 Sender: ${message.sender}\n`;
        messageText += `👀 Subject: ${message.subject || '👉 NO SUBJECT'}\n`;
        messageText += `📩 Message: ${message.message.replace(/<style([\s\S]*?)<\/style>|<script([\s\S]*?)<\/script>|<\/div>|<div>|<[^>]*>/gi, '')}\n\n`;
      }

      message.reply(messageText);
    } else {
      const tempMailResponse = await axios.get(TEMP_MAIL_URL);
      const tempMailData = tempMailResponse.data;

      if (!tempMailData.email) {
        return message.reply("❌ Failed to generate temporary email.");
      }

      message.reply(`📩 Here's your generated temporary email: ${tempMailData.email}`);
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply("No messages found in the current email).");
  }
};

export default {
  config,
  onCall
};