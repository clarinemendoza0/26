import axios from 'axios';
import fs from 'fs';

const config = {
  name: "install",
  version: "1.0",
  credits: "Blake Cyphrus󱢏 (Converted by Grim)",
  description: "Install a module or command from a Pastebin link.",
  cooldown: 5,
  usage: "[/directory/filename] [pastebin link]",
  permissions: [2]
};

async function onCall({ message, args, prefix }) {
  try {
    if (args.length !== 2) {
      return message.reply(`Invalid usage. Example usage: ${prefix}${config.name} /Test/test.js`);
    }

    let filename = args[0];
    let pastebinLink = args[1];

    try {
      const response = await axios.get(pastebinLink);
      if (response.status === 200) {
        // Write the retrieved code to the specified filename in your project directory
        fs.writeFileSync(process.cwd() + '/plugins/commands/' + args[0], response.data, "utf-8");
        message.reply(`Installed ${filename} successfully in your commands.`);
      } else {
        message.reply(`Error: Unable to install the module or command. HTTP Status: ${response.status}`);
      }
    } catch (error) {
      message.reply(`Error: Unable to install the module or command. Details: ${error.message}`);
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

export default {
  config,
  onCall
};