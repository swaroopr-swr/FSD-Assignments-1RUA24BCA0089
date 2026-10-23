const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Student = require('../models/Student');

/**
 * GET /
 * Home page displaying live counts and latest 3 lost and found items.
 */
router.get('/', async (req, res, next) => {
  try {
    const [lostCount, foundCount, studentsCount, latestLost, latestFound] = await Promise.all([
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      Student.countDocuments(),
      LostItem.find()
        .populate('reportedBy', 'fullName department')
        .sort({ createdAt: -1 })
        .limit(3),
      FoundItem.find()
        .populate('reportedBy', 'fullName department')
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    res.render('home', {
      currentPath: '/',
      stats: {
        lostCount,
        foundCount,
        studentsCount
      },
      latestLost,
      latestFound
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /report
 * Chooser page to select reporting a lost item or a found item.
 */
router.get('/report', (req, res) => {
  res.render('report', {
    currentPath: '/report'
  });
});

module.exports = router;
