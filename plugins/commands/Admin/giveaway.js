const config = {
  "name": "giveaway",
  "aliases": ["gv"],
  "description": "Giveaway box",
  "usage": "",
  "cooldown": 3,
  "permissions": [2],
  "credits": "WaifuCat",
  "extra": {}
};

export async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const targetID = message.senderID;

  global.api.getThreadInfo(message.threadID, async (err, info) => {
    if (err) {
      console.error(err);
      return;
    }

    switch (args[0]) {
      case 'random':
        const memberIDs = info.participantIDs.filter(id => id !== global.botID);

        for (const memberID of memberIDs) {
          const randomAmount = Math.floor(Math.random() * 10001); 
          await Users.increaseMoney(memberID, randomAmount);
        }

        message.reply('[⚜️] ➜ Added random amounts for everyone!');
        break;

      case 'amount':
        const amount = parseFloat(args[1]); 
        if (!isNaN(amount)) {
          const memberIDs = info.participantIDs.filter(id => id !== global.botID);

          for (const memberID of memberIDs) {
            await Users.increaseMoney(memberID, amount);
          }

          message.reply(`[⚜️] ➜ Added ${amount} for everyone!`);
        } else {
          message.reply('[⚜️] ➜ Invalid amount.');
        }
        break;

      default:
        message.reply('[⚜️] Menu Instructions for Use [⚜️] \n➜ Use the command with "random" to give away a random amount of money to everyone.\n➜ Use the command with "amount <coin>" to give away <coin> to everyone.');
        break;
    }
  });
}

export default {
  config,
  onCall
};