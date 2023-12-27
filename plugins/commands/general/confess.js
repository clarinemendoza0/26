export const config = {
  name: "confess",
  version: "1.0.2",
  credits: "Deku",
  description: "Confess to someone (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)",
  usage: "[Your message. | fb url]",
  cooldown: 5,
};

export async function onCall({ api, message, args }) {
  const { reply, threadID, messageID } = message;
  const content = args.join(" ").split("|").map(item => item.trim());
  let text1 = content[0];
  let text2 = content[1];

  if (!args[0] || !text1) {
    return reply(`Wrong format\nUse "${config.name} your message | facebook link or ID of a person you want to send a confession".`);
  }

  try {
    let recipientID;

    const match = text2.match(/facebook\.com\/.*\?id=(\d+)/i);

    if (match && match[1]) {
      recipientID = match[1];
    } else {
      recipientID = await global.api.getUID(text2);
    }

    global.api.sendMessage(
      `Someone bot user has confess on you, here is the confess please read it.\n\nMessage: ${text1}`,
      recipientID,
      () => reply("Confession has been sent successfully!")
    );
  } catch (err) {
    console.error("Error sending confession:", err);
    reply("I'm sorry, but your confession failed to send. Please try again later.");
  }
}