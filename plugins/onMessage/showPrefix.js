import axios from 'axios';

const langData = {
    "en_US": {
        "prefix.get": "\𝗠𝗮𝘅í 𝗔𝗜 𝚙𝚛𝚎𝚏𝚒𝚡 𝚒𝚜: {prefix}"
    },
    "vi_VN": {
        "prefix.get": "Prefix hiện tại là: {prefix}"
    }
}

async function onCall({ message, getLang, data }) {
    if (message.body == "prefix" && message.senderID != global.botID) {
        const imageResponse = await axios.get('https://i.imgur.com/SNPfgEC.jpg', {
            responseType: 'stream',
        });


        message.reply({
            body: getLang("prefix.get", {
                prefix: data?.thread?.data?.prefix || global.config.PREFIX
            }),
            attachment: imageResponse.data, 
        });
    }

    return;
}

export default {
    langData,
    onCall
}