const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const queries = {
  'white-pepper.jpg': 'White pepper',
  'mustard-black.jpg': 'Black mustard seeds',
  'coriander-powder.jpg': 'Coriander powder',
  'coffee-powder.jpg': 'Coffee powder',
  'turmeric-powder.jpg': 'Turmeric powder',
  'masala-tea.jpg': 'Masala chai',
  'tea-granules.jpg': 'Black tea',
  'coconut-oil.jpg': 'Coconut oil',
  'groundnut-oil.jpg': 'Peanut oil',
  'sesame-oil.jpg': 'Sesame oil',
  'tapioca-spicy.jpg': 'Tapioca chips',
  'tapioca-nonspicy.jpg': 'Cassava'
};

async function getWikiSearchImage(query, dest) {
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrlimit=3&prop=pageimages&format=json&pithumbsize=400';
    const res = await fetch(url, { headers: { 'User-Agent': 'NodeJS-Agent' } });
    const json = await res.json();
    const pages = json.query.pages;
    if (!pages) return false;
    
    for (const pageId of Object.keys(pages)) {
      if (pages[pageId].thumbnail) {
        const imgUrl = pages[pageId].thumbnail.source;
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const fileStream = fs.createWriteStream(dest, { flags: 'w' });
          await finished(Readable.fromWeb(imgRes.body).pipe(fileStream));
          const stats = fs.statSync(dest);
          if (stats.size > 1000) return true;
        }
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
    const success = await getWikiSearchImage(query, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
