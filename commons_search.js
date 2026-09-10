const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const queries = {
  'groundnut-oil.jpg': 'Peanut oil bottle',
  'sesame-oil.jpg': 'Sesame oil bottle',
  'tapioca-spicy.jpg': 'Tapioca chips',
  'tapioca-nonspicy.jpg': 'Cassava chips',
  'ajwain.jpg': 'Ajwain seeds',
  'white-sesame.jpg': 'White sesame seeds',
  'yellow-mustard.jpg': 'Yellow mustard seeds',
  'coriander-powder.jpg': 'Coriander powder',
  'coffee-powder.jpg': 'Ground coffee',
  'turmeric-powder.jpg': 'Turmeric powder',
  'tea-granules.jpg': 'CTC tea'
};

async function searchCommonsImage(query, dest) {
  try {
    const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap ' + encodeURIComponent(query) + '&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json';
    const res = await fetch(searchUrl, { headers: { 'User-Agent': 'VVM-App/1.0 (admin@vvm.com)' } });
    if (!res.ok) return false;
    const json = await res.json();
    if (!json.query || !json.query.pages) return false;
    
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId] && pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
      const imgUrl = pages[pageId].imageinfo[0].thumburl || pages[pageId].imageinfo[0].url;
      const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'VVM-App/1.0 (admin@vvm.com)' } });
      if (imgRes.ok) {
        const fileStream = fs.createWriteStream(dest, { flags: 'w' });
        await finished(Readable.fromWeb(imgRes.body).pipe(fileStream));
        const stats = fs.statSync(dest);
        return stats.size > 1000;
      }
    }
  } catch (e) {}
  return false;
}

async function run() {
  for (const [filename, query] of Object.entries(queries)) {
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await searchCommonsImage(query, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
