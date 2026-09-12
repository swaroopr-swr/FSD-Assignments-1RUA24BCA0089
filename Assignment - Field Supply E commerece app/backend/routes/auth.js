const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth');
const router = express.Router();

// Hardcoded user
const TEST_USER = {
  username: 'explorer',
  password: 'field123'
};

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === TEST_USER.username && password === TEST_USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token, user: { username } });
  }

  return res.status(401).json({ error: 'Invalid credentials.' });
});

module.exports = router;
