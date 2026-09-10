const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const queries = {
  'white-pepper.jpg': 'White pepper',
  'fennel-seed.jpg': 'Fennel',
  'fenugreek.jpg': 'Fenugreek',
  'poppy-seed.jpg': 'Poppy seed',
  'mustard-black.jpg': 'Black mustard',
  'ajwain.jpg': 'Ajwain',
  'white-sesame.jpg': 'Sesame',
  'yellow-mustard.jpg': 'Mustard seed',
  'coriander-powder.jpg': 'Coriander',
  'coffee-powder.jpg': 'Coffee bean',
  'turmeric-powder.jpg': 'Turmeric',
  'masala-tea.jpg': 'Masala chai',
  'tea-granules.jpg': 'Black tea',
  'coconut-oil.jpg': 'Coconut oil',
  'groundnut-oil.jpg': 'Peanut oil',
  'sesame-oil.jpg': 'Sesame oil',
  'tapioca-spicy.jpg': 'Tapioca chips',
  'tapioca-nonspicy.jpg': 'Tapioca'
};

async function getWikiImage(query, dest) {
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(query) + '&prop=pageimages&format=json&pithumbsize=400';
    const res = await fetch(url, { headers: { 'User-Agent': 'NodeJS-Agent' } });
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId].thumbnail) {
      const imgUrl = pages[pageId].thumbnail.source;
      const imgRes = await fetch(imgUrl);
      if (imgRes.ok) {
        const fileStream = fs.createWriteStream(dest, { flags: 'w' });
        await finished(Readable.fromWeb(imgRes.body).pipe(fileStream));
        const stats = fs.statSync(dest);
        return stats.size > 1000;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function run() {
  for (const [filename, query] of Object.entries(queries)) {
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await getWikiImage(query, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
