const fs = require('fs');
const https = require('https');
const path = require('path');

const queries = {
  'tamarind.jpg': 'Tamarind',
  'pandanus.jpg': 'Pandanus amaryllifolius',
  'white-pepper.jpg': 'White pepper',
  'black-sesame.jpg': 'Sesame',
  'fennel.jpg': 'Fennel',
  'fenugreek.jpg': 'Fenugreek',
  'poppy-seeds.jpg': 'Poppy seed',
  'black-mustard.jpg': 'Black mustard',
  'ajwain.jpg': 'Ajwain',
  'white-sesame.jpg': 'Sesame',
  'yellow-mustard.jpg': 'Mustard seed',
  'coriander-powder.jpg': 'Coriander',
  'coffee-powder.jpg': 'Coffee bean',
  'turmeric.jpg': 'Turmeric',
  'tea-blend.jpg': 'Masala chai',
  'tea-granules.jpg': 'Crush, tear, curl',
  'coconut-oil.jpg': 'Coconut oil',
  'groundnut-oil.jpg': 'Peanut oil',
  'sesame-oil.jpg': 'Sesame oil',
  'tapioca-chips.jpg': 'Tapioca chips'
};

async function getWikiImage(query, filename) {
  return new Promise((resolve) => {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(query) + '&prop=pageimages&format=json&pithumbsize=400';
    https.get(url, { headers: { 'User-Agent': 'NodeJS-Agent' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            const imgUrl = pages[pageId].thumbnail.source;
            const file = fs.createWriteStream(path.join('e:/vvm-fullstack/client/public/images/products', filename));
            https.get(imgUrl, (res2) => {
              res2.pipe(file);
              file.on('finish', () => { file.close(); resolve(true); });
            });
          } else {
            resolve(false);
          }
        } catch(e) { resolve(false); }
      });
    }).on('error', () => resolve(false));
  });
}

async function run() {
  for (const [filename, query] of Object.entries(queries)) {
    const success = await getWikiImage(query, filename);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
