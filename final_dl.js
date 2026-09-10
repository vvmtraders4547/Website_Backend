const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const suffix = ', professional e-commerce product photography, high resolution, white background, realistic, studio lighting';

const items = {
  'groundnut-oil.jpg': 'Bottle of golden peanut oil next to roasted peanuts',
  'sesame-oil.jpg': 'Bottle of dark sesame oil next to sesame seeds',
  'tapioca-spicy.jpg': 'Spicy red tapioca stick chips in a wooden bowl',
  'tapioca-nonspicy.jpg': 'Crispy salted tapioca round chips in a wooden bowl',
  'ajwain.jpg': 'Ajwain carom seeds in a wooden bowl',
  'white-sesame.jpg': 'White sesame seeds in a wooden bowl',
  'yellow-mustard.jpg': 'Yellow mustard seeds in a wooden bowl',
  'coriander-powder.jpg': 'Coriander powder in a wooden bowl',
  'coffee-powder.jpg': 'Fine ground coffee powder in a wooden bowl',
  'turmeric-powder.jpg': 'Bright yellow turmeric powder in a wooden bowl',
  'tea-granules.jpg': 'Black CTC tea granules in a wooden bowl'
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  for (const [filename, prompt] of Object.entries(items)) {
    const seed = Math.floor(Math.random() * 100000);
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt + suffix) + '?width=400&height=400&nologo=true&seed=' + seed;
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    
    let success = false;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const fileStream = fs.createWriteStream(dest, { flags: 'w' });
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
        const stats = fs.statSync(dest);
        if (stats.size > 20000) success = true;
      }
    } catch(e) {}
    
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
    await delay(15000); // Wait 15 seconds to completely avoid rate limiting
  }
}
run();
