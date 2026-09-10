const fs = require('fs');
const https = require('https');
const path = require('path');

const suffix = ', professional e-commerce product photography, high resolution, white background, realistic, studio lighting';

const items = {
  'kudam-puli.jpg': 'Dried Malabar Tamarind Kudam Puli in a wooden bowl',
  'pandanus.jpg': 'Fresh green Pandanus leaves in a wooden bowl',
  'vaalan-puli.jpg': 'Dried sweet Tamarind pods in a wooden bowl',
  'white-pepper.jpg': 'White peppercorns in a wooden bowl',
  'black-sesame.jpg': 'Black sesame seeds in a wooden bowl',
  'fennel-seed.jpg': 'Fennel seeds in a wooden bowl',
  'fenugreek.jpg': 'Fenugreek seeds in a wooden bowl',
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

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
         https.get(response.headers.location, (res2) => {
            res2.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
         }).on('error', err => resolve(false));
      } else {
        file.close(); fs.unlink(dest, () => resolve(false));
      }
    }).on('error', (err) => {
      file.close(); fs.unlink(dest, () => resolve(false));
    });
  });
}

async function run() {
  for (const [filename, prompt] of Object.entries(items)) {
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt + suffix) + '?width=400&height=400&nologo=true';
    const dest = path.join('e:/vvm-fullstack/client/public/images/products', filename);
    const success = await download(url, dest);
    console.log(filename + ': ' + (success ? 'OK' : 'FAIL'));
  }
}
run();
