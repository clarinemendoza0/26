import axios from 'axios';
import cheerio from 'cheerio';

const config = {
  name: 'lyrics',
  version: '1.0.5',
  hasPermission: 0,
  credits: 'August Quinn',
  description: 'Get song lyrics from Google or Musixmatch.',
  usage: '[song name]',
  cooldown: 5,
};

async function onCall({ message, args }) {
  const query = args.join(' ');

  if (!query) {
    message.reply('Please provide a song name to get lyrics.');
    return;
  }

  try {
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+lyrics`;
    const googleResponse = await axios.get(googleUrl, { headers });
    const $ = cheerio.load(googleResponse.data);
    const data = $('div[data-lyricid]');
    let lyrics, authors;

    if (data.length > 0) {
      const content = data.html().replace('</span></div><div.*?>', '\n</span>');
      const parse = cheerio.load(content);
      lyrics = parse('span[jsname]').text();
      authors = $('div.auw0zb').text().replace(/(\S+)\s*/g, '$1 ').trim();
    } else {
      const musixmatchUrl = `https://www.musixmatch.com/search/${encodeURIComponent(query)}`;
      const musixmatchResponse = await axios.get(musixmatchUrl, { headers });
      const mxmMatch = musixmatchResponse.data.match(/<a class="title" href="(.*?)"/);

      if (mxmMatch) {
        const mxmUrl = `https://www.musixmatch.com${mxmMatch[1]}`;
        const mxmResponse = await axios.get(mxmUrl, { headers });
        lyrics = cheerio.load(mxmResponse.data)('.lyrics__content__ok').text();
        authors = cheerio.load(mxmResponse.data)('.mxm-track-title__artist-link').text().replace(/(\S+)\s*/g, '$1 ').trim();
      }
    }

    if (lyrics && lyrics.trim() !== '') {
      message.reply(`🎵 𝗟𝗬𝗥𝗜𝗖𝗦:\n\n${lyrics}\n\n👤 𝗦𝗜𝗡𝗚𝗘𝗥: ${authors || 'unknown'}`);
    } else {
      message.reply('Sorry, no result found.');
    }
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching lyrics.');
  }
};

export default {
  config,
  onCall
}