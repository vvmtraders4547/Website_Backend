// routes/analytics.js
const express = require('express');
const router = express.Router();
const { products, enquiries, orders } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/analytics/summary — admin only
router.get('/summary', authMiddleware, (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const enquiriesByMonth = Array(12).fill(0);
  const revenueByMonth = Array(12).fill(0);

  enquiries.forEach(e => {
    if (e.date) {
      const monthIdx = parseInt(e.date.split('-')[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx <= 11) enquiriesByMonth[monthIdx]++;
    }
  });

  orders.forEach(o => {
    if (o.date) {
      const monthIdx = parseInt(o.date.split('-')[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx <= 11) revenueByMonth[monthIdx] += (o.total || 0);
    }
  });

  const monthlyEnquiries = months.slice(0, 12).map((month, i) => ({ month, count: enquiriesByMonth[i] }));
  const monthlyRevenue = months.slice(0, 12).map((month, i) => ({ month, revenue: revenueByMonth[i] }));

  const summary = {
    totalProducts: products.length,
    totalEnquiries: enquiries.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingEnquiries: enquiries.filter(e => e.status === 'Pending').length,
    inProgressEnquiries: enquiries.filter(e => e.status === 'In Progress').length,
    repliedEnquiries: enquiries.filter(e => e.status === 'Replied').length,
    inStockProducts: products.filter(p => p.stock === 'In Stock').length,
    limitedProducts: products.filter(p => p.stock === 'Limited').length,
    outOfStockProducts: products.filter(p => p.stock === 'Out of Stock').length,
    productsByCategory: {
      powder: products.filter(p => p.cat === 'powder').length,
      whole: products.filter(p => p.cat === 'whole').length,
      seed: products.filter(p => p.cat === 'seed').length,
      blend: products.filter(p => p.cat === 'blend').length,
      oil: products.filter(p => p.cat === 'oil').length,
      snack: products.filter(p => p.cat === 'snack').length,
    },
    ordersByStatus: {
      Pending: orders.filter(o => o.status === 'Pending').length,
      Processing: orders.filter(o => o.status === 'Processing').length,
      'In Transit': orders.filter(o => o.status === 'In Transit').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
    },
    recentEnquiries: enquiries.slice(0, 5),
    recentOrders: orders.slice(0, 5),
    monthlyEnquiries,
    monthlyRevenue,
  };
  res.json({ success: true, data: summary });
});

module.exports = router;
