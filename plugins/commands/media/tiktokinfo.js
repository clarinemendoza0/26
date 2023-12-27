const config = {
  name: "tikinfo",
  description: "info account ttok",
  usage: ["tikin4","infotik","in4tik"],
  credits: "ndt22w",
  cooldown: 5,
};
//dân ửa lồn tuổi với anh kkk
//địt mẹ vua móc lồn 
const langData = {
  vi_VN: {
    result:
      "Id tiktok: {id}\nUsername: {user}\nAvatar (Cỡ bé): {avatarthumb}\nAvatar (Cỡ trung bình): {avatarmedium}\nAvatar (Cỡ lớn): {avatarlarger}\nXác minh: {verified}\nĐang follow: {dangfollow}\nNgười theo dõi: {follower}\nKênh Youtube: {kenhyt}\nTwitter: {twitter}\nInstagram: {instagram}\nLượt tim: {heart}\nVideo: {video}",
    missingInput: "Vui lòng nhập ID tài khoản Facebook của bạn",
    notFound: "Không tìm thấy dữ liệu.",
    error: "Đã xảy ra lỗi. Xin lỗi vì sự bất tiện này.",
  }
};
async function onCall({ message, args, getLang }) {
  try { 
    const input = args[0]; 
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const url = `https://tiktok--hehehehehehehehehhehehee.repl.co/?user=${encodedInput}`;
    const res = await global.GET(url);
    const data = res?.data || {};

    if (Object.keys(data).length === 0) {
      return message.reply(getLang("notFound"));
    }
     const verified = res.data.tichxanh ? "Đã được xác minh" : "Không được xác minh"
    const response = getLang("result", {     
      id: data.id,
      user: data.user,
      nickname: data.nickname,
      avatarthumb: data.avatarthumb,
      avatarmedium: data.avatarmedium,
      avatarlarger: data.avatarlarger,
      signature: data.signature,
      verified: verified,
      dangfollow: data.dangfollow,
      follower: data.follower,
      kenhyt: data.kenhyt,
      twitter: data.twitter,
      instagram: data.instagram,
      heart: data.heart,
      video: data.video,
    });
    return message.reply(response);
  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}
export default {
  config,
  langData,
  onCall,
};