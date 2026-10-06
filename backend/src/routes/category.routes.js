const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { categories: fallbackCategories } = require('../utils/fallbackData');

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
      if (categories && categories.length > 0) {
        return res.status(200).json({ success: true, count: categories.length, categories });
      }
    }
    // Return authentic fallback categories if DB not seeded or disconnected
    res.status(200).json({ success: true, count: fallbackCategories.length, categories: fallbackCategories });
  } catch (err) {
    res.status(200).json({ success: true, count: fallbackCategories.length, categories: fallbackCategories });
  }
});

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const category = await Category.create(req.body);
      return res.status(201).json({ success: true, category });
    }
    const newCat = { ...req.body, _id: 'cat_' + Date.now(), id: 'cat_' + Date.now() };
    fallbackCategories.push(newCat);
    res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

module.exports = router;
