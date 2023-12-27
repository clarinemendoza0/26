import PastebinAPI from 'pastebin-js';
import fs from 'fs';
import path from 'path';

const config = {
  name: "paste",
  aliases: ['bin', 'pastebin', 'adc'],
  version: "1.0.0",
  author: "OtinXSandip",
  permissions: [2],
  cooldown: 5,
  credits: "Grim",
  description: "This command allows you to upload files and text to Pastebin and send the link to the file.",
  usage: "file <name> | paste text <text>."
};

async function onCall({ args, message }) {
  const pastebin = new PastebinAPI({
    api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9', // You can use your own
    api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9'  // You can use your own
  });

  if (!args[0]) {
    return message.reply('Please learn how to use $paste text (words) or paste file (filename)');
  }

  if (args[0] === "text") {
    const text = args.slice(1).join(" ");
    const paste = await pastebin.createPaste({
      text: text,
      title: "Text Paste",
      format: null,
      privacy: 1,
    }).catch((error) => {
      console.error(error);
    });

    const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");

    message.reply(`Text created ✅ \n🔗 Text Link: ${rawPaste}`);
  } else if (args[0] === "file") {
    const fileName = args[1];
    const filePathWithoutExtension = findPlugin(fileName);
    const filePathWithExtension = findPlugin(fileName);

    if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
      return message.reply('File not found!');
    }

    const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) throw err;

      const paste = await pastebin.createPaste({
        text: data,
        title: fileName,
        format: null,
        privacy: 1
      }).catch((error) => {
        console.error(error);
      });

      const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");

      message.reply(`
✅ | File created!\n📁 | File name: ${fileName}\n🔗 | Link: ${rawPaste}`);
    });
  } else {
    message.reply('Please learn how to use $paste text (words) or paste file (filename)');
  }
}

function findPlugin(fileName) {
  const commandPath = path.join(process.cwd(), "plugins", "commands");

  const categories = fs
    .readdirSync(commandPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const cate of categories) {
    const files = fs
      .readdirSync(path.join(commandPath, cate), { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    for (const file of files) {
      if (file == fileName || file == `${fileName}.js`) {
        return path.join(commandPath, cate, file);
      }
    }
  }

  return null;
}

export default {
  config,
  onCall
};