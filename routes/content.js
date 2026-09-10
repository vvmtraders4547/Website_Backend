const express = require('express');
const router = express.Router();
const { content, saveContent } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// Public route to get website content
router.get('/', (req, res) => {
  res.json({ success: true, data: content });
});

// Admin-only route to update content
router.put('/', authMiddleware, (req, res) => {
  const updatedContent = saveContent(req.body);
  res.json({ success: true, message: 'Content updated successfully', data: updatedContent });
});

module.exports = router;
