const express = require('express');
const { products } = require('../data/store');
const router = express.Router();

// GET /api/products - returns full list
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - returns product or 404
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found in the field.' });
  }
  res.json(product);
});

module.exports = router;
