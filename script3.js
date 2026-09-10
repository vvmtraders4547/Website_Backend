const fs = require('fs');
const https = require('https');
const path = require('path');

const queries = {
  'white-pepper.jpg': 'White pepper',
  'black-mustard.jpg': 'Black mustard seeds',
  'yellow-mustard.jpg': 'Mustard seeds',
  'coriander-powder.jpg': 'Coriander powder',
  'coffee-powder.jpg': 'Coffee powder',
  'turmeric.jpg': 'Turmeric powder',
  'tea-blend.jpg': 'Masala chai',
  'tea-granules.jpg': 'Black tea leaves',
  'coconut-oil.jpg': 'Coconut oil',
  'groundnut-oil.jpg': 'Peanut oil',
  'sesame-oil.jpg': 'Sesame oil',
  'tapioca-chips.jpg': 'Tapioca chips'
};

async function getCommonsImage(query, filename) {
  return new Promise((resolve) => {
    // Search Commons for the query
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + query) + '&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json';
    https.get(url, { headers: { 'User-Agent': 'NodeJS-Agent' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            const imgUrl = pages[pageId].imageinfo[0].thumburl;
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
    const success = await getCommonsImage(query, filename);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
