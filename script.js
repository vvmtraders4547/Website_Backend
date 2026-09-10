const fs = require('fs');
const https = require('https');
const path = require('path');

const queries = {
  'tamarind.jpg': 'tamarind',
  'pandanus.jpg': 'pandanus leaf',
  'white-pepper.jpg': 'white peppercorns',
  'black-sesame.jpg': 'black sesame seeds',
  'fennel.jpg': 'fennel seeds',
  'fenugreek.jpg': 'fenugreek seeds',
  'poppy-seeds.jpg': 'poppy seeds',
  'black-mustard.jpg': 'black mustard seeds',
  'ajwain.jpg': 'carom seeds',
  'white-sesame.jpg': 'sesame seeds',
  'yellow-mustard.jpg': 'yellow mustard seeds',
  'coriander-powder.jpg': 'coriander powder',
  'coffee-powder.jpg': 'coffee powder',
  'turmeric.jpg': 'turmeric powder',
  'tea-blend.jpg': 'masala chai',
  'tea-granules.jpg': 'black tea leaves',
  'coconut-oil.jpg': 'coconut oil bottle',
  'groundnut-oil.jpg': 'peanut oil',
  'sesame-oil.jpg': 'sesame oil bottle',
  'tapioca-chips.jpg': 'tapioca chips'
};

async function getUnsplashImage(query, filename) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/s/photos/' + encodeURIComponent(query), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^\s"']+/);
        if (match) {
          let imgUrl = match[0].split('?')[0] + '?auto=format&fit=crop&w=400&h=400&q=80';
          const file = fs.createWriteStream(path.join('e:/vvm-fullstack/client/public/images/products', filename));
          https.get(imgUrl, (res2) => {
            res2.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
          });
        } else {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

async function run() {
  for (const [filename, query] of Object.entries(queries)) {
    const success = await getUnsplashImage(query, filename);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
