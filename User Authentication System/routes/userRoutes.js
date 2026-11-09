const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getProfile, adminDashboard } = require('../controllers/userController');

const userRouter = express.Router();
userRouter.get('/profile', protect, getProfile);

const adminRouter = express.Router();
adminRouter.get('/dashboard', protect, authorize('admin'), adminDashboard);

module.exports = { userRouter, adminRouter };
