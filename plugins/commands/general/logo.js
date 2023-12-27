import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "logo",
    aliases: ["logos"],
    version: "1.0.0",
    credits: "Samuel Kâñèñgeè (Converted by Grim)",
    cooldown: 5,
    description: "Generate a logo."
  },
  onCall: async function({ message, args, prefix }) {
    const reply = message.reply

    if (args.length >= 2 && args[0].toLowerCase() === "list") {
      let page = parseInt(args[1]);
      switch (page) {
        case 1:
          return reply(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝑒𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒍𝒐𝒈𝒐 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 1:\n\n
❍ aglitch ❍ Business ❍  blood\n❍ blackpink ❍ broken ❍ christmas\n❍ captainamerica
❍ carbon ❍ circuit\n❍ choror
❍ christmas ❍ discovery\n❍ devil
❍ dropwater ❍ fiction\n❍ fire ❍ glass
❍ greenhorror\n❍ imglitch ❍ layered
❍ light\n❍ magma ❍ metallic
❍ neon\n❍ skeleton ❍ sketch
❍ stone\n❍ love ❍ transformers ❍ wall\n\n
𝑷𝑨𝑮𝑬 1 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`
          );
        case 2:
          return reply(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝑒𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒍𝒐𝒈𝒐 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 2:\n\n❍ naruto ❍ dragonfireavater\n❍ pubgavater ❍ nightstars ❍ sunlight\n❍ cloud ❍ pig ❍ caper\n❍ writestatus ❍ horror ❍ teamlogo \n❍ queen ❍ beach ❍ fbc3\n❍ tatto ❍ shirt3 ❍ oceansea\n❍ shirt4 ❍ shirt5 ❍ shirt6\n❍ lovemsg ❍ chstm ❍ christmas2\n❍ icetext ❍ butterlfy ❍ coffe\n\n𝑷𝑨𝑮𝑬 2 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`
          );
        case 3:
          return reply(
            `╔════ஜ۩۞۩ஜ═══╗\n\n𝑯𝑒𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒍𝒐𝒈𝒐 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 3:\n\n❍ smoke\n\n𝑷𝑨𝑮𝑬 3 - 3\n\n╚════ஜ۩۞۩ஜ═══╝`
          );
        default:
          return reply(
            `Invalid page number! Please use "${prefix}logo list 1" or "${prefix}logo list 2" or "${prefix}logo list 3" to view the available logo lists.`
          );
      }
    }

    if (args.length < 2) {
      return reply(
        `Invalid command format! Use: ${prefix}logo list (page number) or ${prefix}logo (logo name) (text)`
      );
    }

    let type = args[0].toLowerCase();
    let text = args.slice(1).join(" ");
    let pathImg = path.join(global.cachePath, `${message.threadID}_${type}_${text}.png`);
    let apiUrl, mess;

    switch (type) {
      case "glass":
        apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=4&text=${text}`;
        mess = "Here's the [GLASS] Logo created:";
        break;
      case "business":
        apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=5&text=${text}`;
        mess = "Here's the [𝑩𝑼𝑺𝑰𝑵𝑬𝑺𝑺] Logo created:";
        break;
      case "wall":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/embossed?text=${text}`;
        mess = "Here's the [WALL] Logo created:";
        break;
      case "aglitch":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/aglitch?text=${text}&text2=${text}`;
        mess = "Here's the [AGLITCH ] Logo created:";
        break;
      case "berry":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/berry?text=${text}`;
        mess = "Here's the [𝑩𝑬𝑹𝑹𝒀] Logo created:";
        break;
      case "blackpink":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/blackpink?text=${text}`;
        mess = "Here's the [𝑩𝑳𝑨𝑪𝑲𝑷𝑰𝑵𝑲] Logo created:";
        break;
      case "blood":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/blood?text=${text}`;
        mess = "Here's the [𝑩𝑳𝑶𝑶𝑫] Logo created:";
        break;
      case "broken":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/broken?text=${text}`;
        mess = "Here's the [𝑩𝑹𝑶𝑲𝑬𝑵] Logo created:";
        break;
      case "smoke":
        apiUrl = `https://api.lolhuman.xyz/api/photooxy1/smoke?apikey=0a637f457396bf3dcc21243b&text=${text}`;
        mess = "Here's the [𝑺𝑴𝑶𝑲𝑬] Logo created:";


        break;
      case "captainamerica":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/captainamerica?text=${test}&text2=${text}`;
        mess = "Here's the [𝑪𝑨𝑷𝑻𝑨𝑰𝑵𝑨𝑴𝑬𝑹𝑰𝑪𝑨] logo created:";
        break;
      case "carbon":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/carbon?text=${text}`;
        mess = "Here's the [𝑪𝑨𝑹𝑩𝑶𝑵] created:";
        break;
      case "choror":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/choror?text=${text}&text2=${text}`;
        mess = "Here's the [𝑪𝑯𝑶𝑹𝑶𝑹] Logo created:";
        break;
      case "christmas":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/christmas?text=${text}`;
        mess = "Here's the [𝑪𝑯𝑹𝑰𝑺𝑻𝑴𝑨𝑺] Logo created:";
        break;
      case "circuit":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/circuit?text=${text}`;
        mess = "Here's the [𝑪𝑰𝑹𝑪𝑼𝑰𝑻] Logo created:";
        break;
      case "devil":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/devil?text=${text}`;
        mess = "Here's the [𝑫𝑬𝑽𝑰𝑳] Logo created:";
        break;
      case "discovery":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/discovery?text=${text}`;
        mess = "Here's the [𝑫𝑰𝑺𝑪𝑶𝑽𝑬𝑹𝒀] Logo created:";
        break;
      case "dropwater":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/dropwater?text=${text}`;
        mess = "Here's the [𝑫𝑹𝑶𝑷𝑾𝑨𝑻𝑬𝑹] Logo created:";
        break;
      case "fiction":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/fiction?text=${text}`;
        mess = "Here's the [𝑭𝑰𝑪𝑻𝑰𝑶𝑵] Logo created:";
        break;
      case "firework":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/firework?text=${text}`;
        mess = "Here's the [𝑭𝑰𝑹𝑬𝑾𝑶𝑹𝑲] Logo created:";
        break;
      case "galaxy":
        apiUrl = `https://rest-api-001.faheem001.repl.co/api/textpro?number=173&text=${text}`;
        mess = "Here's the [𝑮𝑨𝑳𝑨𝑿𝒀] Logo created:";
        break;
      case "glossy":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/glossy?text=${text}`;
        mess = "Here's the [𝑮𝑳𝑶𝑺𝑺𝒀] Logo created:";
        break;
      case "glue":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/glue?text=${text}`;
        mess = "Here's the [𝑮𝑳𝑼𝑬] Logo created:";
        break;
      case "gradient":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/gradient?text=${text}`;
        mess = "Here's the [𝑮𝑹𝑨𝑫𝑰𝑬𝑵𝑻] Logo created:";
        break;
      case "greenhorror":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/greenhorror?text=${text}`;
        mess = "Here's the [𝑮𝑹𝑬𝑬𝑵𝑯𝑶𝑹𝑹𝑶𝑹] Logo created:";
        break;
      case "spooky":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/spooky?text=${text}&text2=${text}`;
        mess = "Here's the [𝑺𝑷𝑶𝑶𝑲𝒀] Logo created:";
        break;
      case "imglitch":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/imglitch?text=${text}`;
        mess = "Here's the [𝑰𝑴𝑮𝑳𝑰𝑻𝑪𝑯] Logo created:";
        break;
      case "layered":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/layered?text=${text}&text2=${text}`;
        mess = "Here's the [𝑳𝑨𝒀𝑬𝑹𝑬𝑫] Logo created:";
        break;
      case "light":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/light?text=${text}`;
        mess = "Here's the [𝑳𝑰𝑮𝑯𝑻] Logo created:";
        break;
      case "magma":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/magma?text=${text}`;
        mess = "Here's the [𝑴𝑨𝑮𝑴𝑨] Logo created:";
        break;
      case "metallic":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/metallic?text=${text}`;
        mess = "Here's the [𝑴𝑬𝑻𝑨𝑳𝑳𝑰𝑪] Logo created:";
        break;
      case "neon":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/neon?text=${text}`;
        mess = "Here's the [𝑵𝑬𝑶𝑵] Logo created:";
        break;
      case "skeleton":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/skeleton?text=${text}`;
        mess = "Here's the [𝑺𝑲𝑬𝑳𝑬𝑻𝑶𝑵] Logo created:";
        break;
      case "sketch":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/sketch?text=${text}`;
        mess = "Here's the [𝑺𝑲𝑬𝑻𝑪𝑯] Logo created:";
        break;
      case "stone":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/stone?text=${text}`;
        mess = "Here's the [𝑺𝑻𝑶𝑵𝑬] Logo created:"; break;
      case "transformer":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/textpro/transformer?text=${text}`;
        mess = "Here's the [𝑻𝑹𝑨𝑵𝑺𝑭𝑶𝑹𝑴𝑬𝑹] Logo created:";
        break;
      case "fire":
        apiUrl = `https://chards-bot-api.richardretadao1.repl.co/api/photooxy/flaming?text=${text}`;
        mess = "Here's the [𝑭𝑰𝑹𝑬] Logo created:";
        break;
      case "naruto":
        apiUrl = `https://rest-api-2.faheem007.repl.co/api/photooxy/naruto?text=${text}`;
        mess = "Here's the [𝑵𝑨𝑹𝑼𝑻𝑶] Logo created:";
        break;
      case "dragonfire":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/dragonfire?text=${text}`;
        mess = "Here's the [Pubg] Logo created:";
        break;
      case "avater":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lolnew?text=${text}`;
        mess = "Here's the [AVATAR] Logo created:";
        break;
      case "pubgavatar":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pubgavatar?text=${text}`;
        mess = "Here's the [PUBGAVATAR] Logo created:";
        break;
      case "nightstars":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/nightstars?text=${text}`;
        mess = "Here's the [NIGHTSTARS] Logo created:";
        break;
      case "sunlight":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/sunlight?text=${text}`;
        mess = "Here's the [SUNLIGHT] Logo created:";
        break;
      case "cloud":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/cloud?text=${text}`;
        mess = "Here's the [CLOUD] Logo created:";
        break;
      case "pig":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pig?text=${text}`;
        mess = "Here's the [PIG] Logo created:";
        break;
      case "caper":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/caper?text=${text}`;
        mess = "Here's the [CAPER] Logo created:";
        break;
      case "horror":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/horror?text=${text}`;
        mess = "Here's the [HORROR] Logo created:";
        break;
      case "writestatus":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/writestatus?text=${text}&text2=Your%20Quotes%20In%20Herm`;
        mess = "Here's the [WRITESTATUS] Logo created:";
        break;
      case "teamlogo":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/teamlogo?text=${text}`;
        mess = "Here's the [TEAMLOGO] Logo created:";
        break;
      case "beach":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/beach?text=${text}`;
        mess = "Here's the [BEACH] Logo created:";
        break;
      case "queen":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/queen?text=${text}`;
        mess = "Here's the [QUEEN] Logo created:";
        break;
      case "fbc3":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/facebookcover3?text=${text}`;
        mess = "Here's the [FBC3] Logo created:";
        break;
      case "tatto":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/tatto?text=${text}`;
        mess = "Here's the [TATTO] Logo created:";
        break;
      case "shirt3":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt3?text=${text}&text2=20`;
        mess = "Here's the [SHIRT3] Logo created:";
        break;
      case "oceansea":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/oceansea?text=${text}`;
        mess = "Here's the [SEA] Logo created:";
        break;
      case "shirt4":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt4?text=${text}&text2=20`;
        mess = "Here's the [SHIRT4] Logo created:";
        break;
      case "shirt5":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt5?text=${text}&text2=20`;
        mess = "Here's the [SHIRT5] Logo created:";
        break;
      case "shirt6":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt6?text=${text}&text2=20`;
        mess = "Here's the [SHIRT6] Logo created:";
        break;
      case "lovemsg":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/lovemess?text=${text}`;
        mess = "Here's the [LOVEMSG] Logo created:";
        break;
      case "chstm":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Chirstmasvideo?text=${text}&type=video/mp4`;
        mess = "Here's the [CHIRTMAS] Logo created:";
        break;
      case "christmas2":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Christmas2?text=${text}`;
        mess = "Here's the [CHRISTMAS] Logo created:";
        break;
      case "icetext":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/icetext?url=https://i.imgur.com/BTPUTRQ.jpg&text=${text}`;
        mess = "Here's the [ICETEXT] Logo created:";
        break;
      case "butterfly":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/butterfly?text=${text}`;
        mess = "Here's the [BUTTERFLY 🦋] Logo created:";
        break;
      case "coffe":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/photooxy/coffecup?text=${text}`;
        mess = "Here's the [COFFEE] Logo created:";
        break;
      case "love":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lovetext?text=${text}`;
        mess = "Here's the [LOVETEXT] Logo created:";
        break;
      case "intro2":
        apiUrl = `https://faheem-vip-010.faheem001.repl.co/api/ephoto/intro2?text=${text}&type=video/mp4`;
        mess = "Here's the [AVATER] Logo created:";

        break;
      default:
        return mess.reply(
          `•°•°•°•°•°•°۩۞۩°•°•°•°•°•°•\n\nInvalid logo type! Use "list 1" to see the list of textpro logos.\n\n•°•°•°•°•°•°۩۞۩°•°•°•°•°•°•`
        );
    }

    try {
      await message.react("⏳");
      let response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(response.data, "binary"));

      await message.react("✅");
      return reply(
        {
          attachment: fs.createReadStream(pathImg),
          body: mess
        },
        () => fs.unlinkSync(pathImg)
      );
    } catch (err) {
      console.error(err);
      return reply(
        `╔════ஜ۩۞۩ஜ═══╗\n\nAn error occurred while generating the logo. Please try again later.\n\n╚════ஜ۩۞۩ஜ═══╝`
      );
    }
  },
};