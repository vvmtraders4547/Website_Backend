const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const queries = {
  'white-pepper.jpg': 'pepper,corn',
  'mustard-black.jpg': 'mustard,seed',
  'coriander-powder.jpg': 'coriander,powder',
  'coffee-powder.jpg': 'coffee,powder',
  'turmeric-powder.jpg': 'turmeric,powder',
  'masala-tea.jpg': 'masala,tea',
  'tea-granules.jpg': 'black,tea',
  'coconut-oil.jpg': 'coconut,oil',
  'groundnut-oil.jpg': 'peanut,oil',
  'sesame-oil.jpg': 'sesame,oil',
  'tapioca-spicy.jpg': 'tapioca,chips',
  'tapioca-nonspicy.jpg': 'cassava,chips'
};

async function getFlickrImage(query, dest) {
  try {
    const url = 'https://loremflickr.com/400/400/' + query + '/all';
    const res = await fetch(url, { redirect: 'follow' });
    if (res.ok) {
      const fileStream = fs.createWriteStream(dest, { flags: 'w' });
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      const stats = fs.statSync(dest);
      if (stats.size > 1000) return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function run() {
  for (const [filename, query] of Object.entries(queries)) {
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await getFlickrImage(query, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
