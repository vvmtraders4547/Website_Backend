const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const titles = {
  'fennel-seed.jpg': 'File:Fennel_seed.jpg',
  'poppy-seed.jpg': 'File:Poppy_seeds.jpg',
  'ajwain.jpg': 'File:Ajwain.jpg',
  'white-sesame.jpg': 'File:White_sesame_seeds.jpg',
  'yellow-mustard.jpg': 'File:Yellow_mustard_seeds.jpg',
  'coriander-powder.jpg': 'File:Coriander_powder.jpg',
  'coffee-powder.jpg': 'File:Coffee_powder.jpg',
  'turmeric-powder.jpg': 'File:Turmeric_powder.jpg',
  'masala-tea.jpg': 'File:Masala_chai.jpg',
  'tea-granules.jpg': 'File:Black_tea_leaves.jpg',
  'groundnut-oil.jpg': 'File:Peanut_oil.jpg',
  'sesame-oil.jpg': 'File:Sesame_oil.jpg',
  'tapioca-spicy.jpg': 'File:Tapioca_chips.jpg',
  'tapioca-nonspicy.jpg': 'File:Tapioca_chips.jpg'
};

async function getCommonsDirect(title, dest) {
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json';
    const res = await fetch(url, { headers: { 'User-Agent': 'NodeJS-Agent' } });
    if (!res.ok) return false;
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId].imageinfo) {
      const imgUrl = pages[pageId].imageinfo[0].thumburl || pages[pageId].imageinfo[0].url;
      const imgRes = await fetch(imgUrl);
      if (imgRes.ok) {
        const file = fs.createWriteStream(dest);
        await new Promise((resolve) => {
          Readable.fromWeb(imgRes.body).pipe(file);
          file.on('finish', resolve);
        });
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
  for (const [filename, title] of Object.entries(titles)) {
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await getCommonsDirect(title, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
