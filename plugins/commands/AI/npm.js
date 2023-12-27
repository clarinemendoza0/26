import axios from 'axios';

const config = {
  name: "npm",
  version: "1.0.0",
  credits: "August Quinn[Converted by: Ruru]",
  description: "Get NPM package information.",
  usage: "[package-name]",
  cooldowns: 5,
  requiredargs: 1,
};

async function onCall({ message, args }) {
  const packageName = args[0];

  try {
    const response = await axios.get(`http://npm.august-quinn-api.repl.co/${packageName}`);
    const packageInfo = response.data;

    if (packageInfo.error) {
      message.reply(`Error: ${packageInfo.error}`);
    } else {
      let messages = `NPM Package: ${packageInfo.name}\n`;

      if ('version' in packageInfo) {
        messages += `Version: ${packageInfo.version}\n`;
        messages += `Last Modified: ${packageInfo.modified || 'N/A'}\n`;
        messages += `Dependencies: ${packageInfo.dependencies ? Object.keys(packageInfo.dependencies).join(', ') : 'N/A'}\n`;
        messages += `Optional Dependencies: ${packageInfo.optionalDependencies ? Object.keys(packageInfo.optionalDependencies).join(', ') : 'N/A'}\n`;
      } else {
        messages += `Latest Version: ${packageInfo['dist-tags'].latest}\n`;
        messages += `Description: ${packageInfo.description || 'N/A'}\n`;
        messages += `License: ${packageInfo.license || 'N/A'}\n`;
        messages += `Author: ${packageInfo.author ? packageInfo.author.name || 'N/A' : 'N/A'}\n`;
        messages += `Homepage: ${packageInfo.homepage || 'N/A'}\n`;
        messages += `Keywords: ${packageInfo.keywords ? packageInfo.keywords.join(', ') : 'N/A'}\n`;
        messages += `Maintainers: ${packageInfo.maintainers ? packageInfo.maintainers.map(m => m.name).join(', ') : 'N/A'}\n`;
        messages += `ReadmeFilename: ${packageInfo.readmeFilename || 'N/A'}\n`;
        messages += `Repository: ${packageInfo.repository ? packageInfo.repository.url || 'N/A' : 'N/A'}\n`;
        messages += `Bugs: ${packageInfo.bugs ? packageInfo.bugs.url || 'N/A' : 'N/A'}\n`;
      }

      message.reply(messages);
    }
  } catch (error) {
    console.error('[ERROR]', error);
     message.reply("An error occurred while fetching NPM package information.");
  }
};

export default {
  config,
  onCall
};