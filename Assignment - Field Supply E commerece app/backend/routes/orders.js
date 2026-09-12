const express = require('express');
const { products, orders } = require('../data/store');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders
router.post('/', requireAuth, (req, res) => {
  const { cart } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  // Validate stock for each item
  for (const item of cart) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found.` });
    }
    if (item.quantity <= 0) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}.` });
    }
    if (item.quantity > product.stock) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}.` });
    }
  }

  // Deduct stock
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });

  // Create order
  const newOrder = {
    id: Date.now().toString(),
    userId: req.user.username,
    items: cart.map(item => {
      const p = products.find(p => p.id === item.productId);
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: item.quantity
      };
    }),
    total: cart.reduce((acc, item) => {
      const p = products.find(p => p.id === item.productId);
      return acc + (p.price * item.quantity);
    }, 0),
    date: new Date().toISOString()
  };

  orders.push(newOrder);

  res.status(201).json({ message: 'Order placed successfully', order: newOrder });
});

// GET /api/orders
router.get('/', requireAuth, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.username);
  res.json(userOrders);
});

module.exports = router;
