const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const suffix = ', professional e-commerce product photography, high resolution, white background, realistic, studio lighting';

const items = {
  'poppy-seed.jpg': 'White poppy seeds in a wooden bowl',
  'mustard-black.jpg': 'Black mustard seeds in a wooden bowl',
  'ajwain.jpg': 'Ajwain carom seeds in a wooden bowl',
  'white-sesame.jpg': 'White sesame seeds in a wooden bowl',
  'yellow-mustard.jpg': 'Yellow mustard seeds in a wooden bowl',
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

async function downloadWithTimeout(url, dest, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => { controller.abort(); }, 20000); // 20s timeout
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Not OK');
      const fileStream = fs.createWriteStream(dest, { flags: 'w' });
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      
      // Verify size
      const stats = fs.statSync(dest);
      if (stats.size > 1000) return true;
    } catch (e) {
      console.log('Retry...');
    }
  }
  return false;
}

async function run() {
  for (const [filename, prompt] of Object.entries(items)) {
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt + suffix) + '?width=400&height=400&nologo=true';
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    
    // Check if already exists and valid
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(filename + ': ALREADY EXISTS');
      continue;
    }

    const success = await downloadWithTimeout(url, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
    await delay(1500); // Wait 1.5s between requests
  }
}
run();
