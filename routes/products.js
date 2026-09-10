// routes/products.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { products, saveProducts } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// Category display order: whole → seed → powder → blend → oil → snack
const CAT_ORDER = { whole: 1, seed: 2, powder: 3, blend: 4, oil: 5, snack: 6 };

function sortByCategory(arr) {
  return [...arr].sort((a, b) => {
    const oa = CAT_ORDER[a.cat] ?? 99;
    const ob = CAT_ORDER[b.cat] ?? 99;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name); // A-Z within each category
  });
}

// GET /api/products — public, supports ?cat=&search=&featured=
router.get('/', (req, res) => {
  let result = [...products];
  const { cat, search, featured } = req.query;
  if (cat && cat !== 'all') result = result.filter(p => p.cat === cat);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (featured === 'true') result = result.filter(p => p.featured);
  result = sortByCategory(result);
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/:id — public
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

// POST /api/products — admin only
router.post('/', authMiddleware, (req, res) => {
  const { name, emoji, cat, catLabel, desc, tags, origin, grade, packSize, availability, stock, price, startPrice, endPrice, unit, featured } = req.body;
  if (!name || !cat) return res.status(400).json({ success: false, message: 'name and cat are required' });
  const sPrice = String(startPrice || price || '0');
  const ePrice = String(endPrice || sPrice);
  const newProduct = {
    id: uuidv4(), name, emoji: emoji || '🌿', cat, catLabel: catLabel || cat,
    desc: desc || '', tags: tags || [], origin: origin || '', grade: grade || '',
    packSize: packSize || '', availability: availability || 'Year Round',
    stock: stock || 'In Stock', startPrice: sPrice, endPrice: ePrice, price: sPrice, unit: unit || 'kg',
    featured: featured || false,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  saveProducts();
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id — admin only
router.put('/:id', authMiddleware, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  const updated = { ...products[idx], ...req.body, id: products[idx].id, updatedAt: new Date().toISOString() };
  products[idx] = updated;
  saveProducts();
  res.json({ success: true, data: updated });
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authMiddleware, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  products.splice(idx, 1);
  saveProducts();
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = router;
