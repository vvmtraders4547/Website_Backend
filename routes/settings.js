// routes/settings.js
const express = require('express');
const router = express.Router();
const { settings, saveSettings } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/settings
router.get('/', (req, res) => {
  res.json({ success: true, data: settings });
});

// PUT /api/settings — admin only
router.put('/', authMiddleware, (req, res) => {
  const newSettings = req.body;
  const updatedSettings = saveSettings(newSettings);
  res.json({ success: true, data: updatedSettings });
});

module.exports = router;
