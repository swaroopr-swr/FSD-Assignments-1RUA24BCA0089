const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', authRouter); // /api/login

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred in the field.' });
});

app.listen(PORT, () => {
  console.log(`Field Supply Co. Backend running on port ${PORT}`);
});
