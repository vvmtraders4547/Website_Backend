const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const suffix = ', professional e-commerce product photography, high resolution, white background, realistic, studio lighting';

const items = {
  'fennel-seed.jpg': 'Fennel seeds in a wooden bowl',
  'fenugreek.jpg': 'Fenugreek seeds in a wooden bowl',
  'poppy-seed.jpg': 'White poppy seeds in a wooden bowl',
  'mustard-black.jpg': 'Black mustard seeds in a wooden bowl',
  'ajwain.jpg': 'Ajwain carom seeds in a wooden bowl',
  'white-sesame.jpg': 'White sesame seeds in a wooden bowl',
  'yellow-mustard.jpg': 'Yellow mustard seeds in a wooden bowl',
  'white-pepper.jpg': 'White peppercorns in a wooden bowl',
  'coriander-powder.jpg': 'Coriander powder in a wooden bowl',
  'coffee-powder.jpg': 'Fine ground coffee powder in a wooden bowl',
  'turmeric-powder.jpg': 'Bright yellow turmeric powder in a wooden bowl',
  'masala-tea.jpg': 'Masala chai tea leaves and spices in a wooden bowl',
  'tea-granules.jpg': 'Black CTC tea granules in a wooden bowl',
  'coconut-oil.jpg': 'Bottle of pure coconut oil next to fresh coconuts',
  'groundnut-oil.jpg': 'Bottle of golden peanut oil next to roasted peanuts',
  'sesame-oil.jpg': 'Bottle of dark sesame oil next to sesame seeds',
  'tapioca-spicy.jpg': 'Spicy red tapioca stick chips in a wooden bowl',
  'tapioca-nonspicy.jpg': 'Crispy salted tapioca stick chips in a wooden bowl'
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function downloadWithRetry(url, dest) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Not OK');
      const fileStream = fs.createWriteStream(dest, { flags: 'w' });
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      const stats = fs.statSync(dest);
      if (stats.size > 20000) return true; // Valid AI images are usually > 30kb
    } catch (e) {}
    console.log('Retry...');
    await delay(5000);
  }
  return false;
}

async function run() {
  for (const [filename, prompt] of Object.entries(items)) {
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt + suffix) + '?width=400&height=400&nologo=true';
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await downloadWithRetry(url, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
    await delay(12000); // 12 seconds between requests! Super safe against rate limits.
  }
}
run();
