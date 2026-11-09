require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { userRouter, adminRouter } = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET in .env');
  process.exit(1);
}

const app = express();
app.use(express.json());

// Serve static UI client
app.use('/ui', express.static(path.join(__dirname, 'public')));
app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/', (req, res) => res.json({ success: true, message: 'Auth API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});

module.exports = app;
