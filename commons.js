const fs = require('fs');
const https = require('https');
const path = require('path');
const { Readable } = require('stream');

const titles = {
  'fennel-seed.jpg': 'File:Fennel_seeds_at_a_market_in_Syracuse.jpg',
  'fenugreek.jpg': 'File:Fenugreek_seeds.jpg',
  'poppy-seed.jpg': 'File:White_poppy_seeds.JPG',
  'mustard-black.jpg': 'File:Black_mustard_seeds.jpg',
  'ajwain.jpg': 'File:Ajwain_seeds.jpg',
  'white-sesame.jpg': 'File:Sesame_seeds.jpg',
  'yellow-mustard.jpg': 'File:Yellow_mustard_seeds.jpg',
  'white-pepper.jpg': 'File:White_peppercorns.jpg',
  'coriander-powder.jpg': 'File:Coriander_powder.JPG',
  'coffee-powder.jpg': 'File:Coffee_powder.jpg',
  'turmeric-powder.jpg': 'File:Turmeric_powder.JPG',
  'masala-tea.jpg': 'File:Masala_chai.jpg',
  'tea-granules.jpg': 'File:Black_tea_leaves.jpg',
  'coconut-oil.jpg': 'File:Coconut_oil.jpg',
  'groundnut-oil.jpg': 'File:Peanut_oil.jpg',
  'sesame-oil.jpg': 'File:Sesame_oil.jpg',
  'tapioca-spicy.jpg': 'File:Tapioca_chips.jpg',
  'tapioca-nonspicy.jpg': 'File:Tapioca_chips.jpg'
};

async function getCommonsImageHTML(title, dest) {
  try {
    const url = 'https://commons.wikimedia.org/wiki/' + title;
    const res = await fetch(url);
    if (!res.ok) return false;
    const html = await res.text();
    const match = html.match(/href="(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[^"]+)" class="internal"/);
    if (match && match[1]) {
      const imgUrl = match[1];
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
    const success = await getCommonsImageHTML(title, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
