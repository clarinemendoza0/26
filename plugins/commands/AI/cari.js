import axios from "axios";

const config = {
    name: "cari",
    version: "1.1",
    hasPermission: 0,
    credits: "August Quinn[Converted By: Ruru]",
    description: "Interact with CARI (Conversational Artificial Intelligence)",
    usages: "[response]",
    cooldown: 3,
};

async function onCall({ message, args }) {
    const { senderID } = message
    const prompt = args.join(" ");

    if (!prompt) {
        message.reply("How can I assist you today?");
        return;
    }
   message.react("🔍");

    try {
        const userName = await getUserName(api, senderID);
        const cariAPI = "https://cari.august-quinn-api.repl.co/response";
        const response = await axios.post(cariAPI, { userID: senderID, userName, prompt });
        const reply = response.data.reply;
    message.react("☑️");
        message.reply(reply);
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("⛔ High traffic: Please try again later again.");
    }
};

async function getUserName(api, userID) {
    try {
        const name = await api.getUserInfo(userID);
        return name[userID].firstName;
    } catch (error) {
        console.error("Error getting user name:", error);
        return "Friend";
    }
}

export default {
  config,
  onCall
}