import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
  name: "email",
  version: "1.0.0",
  hasPermssion: 1, //1 admin default note: you make it 0 
  credits: ":EASY-API",
  description: "",
  cooldown: 5,
};

async function onCall({message, args}) {
  if (args.length < 2) {
    message.reply("Usage: ?email <receiver_email> <email_text>");
    return;
  }

  const receiverEmail = args[0];
  const emailText = args.slice(1).join(" ");

  try {
    const response = await axios.post('https://api.easy0.repl.co/v1/email-send', {
      receiver: receiverEmail,
      text: emailText,
    });

    console.log('Email sent:', response.data);
    message.reply('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
    message.reply('Error sending email. Please try again later.');
  }
};

export default {
  config,
  onCall
}