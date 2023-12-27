import axios from "axios";
const config = {
  name: "pussy",
  cooldown: 500,
  permissions: [0,1,2],
  credits: "XaviaTeam",
  nsfw: true
}

const onCall = ({ message }) => {
  axios.get('https://api.night-api.com/images/nsfw/pussy', {
    headers: {
      authorization: "euEqievjzj-9AWVHD30KG6FLWPogZGR-Z3K296BBT4"
    }
  })
    .then(response => {
      const imageUrl = response.data.content.url;
      if (imageUrl) {
        global.getStream(imageUrl)
          .then(stream => message.reply({ attachment: stream }).catch(e => console.log(e)))
          .catch(e => console.log(e));
      } else {
        message.reply("Không tìm thấy ảnh");
      }
    })
    .catch(e => console.log(e));
};

export {
  config,
  onCall
};