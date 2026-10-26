const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { isValidObjectId } = require('../utils/validators');

/**
 * GET /students/new
 * Discontinued legacy route: redirects permanently to verified registration (C5).
 */
router.get('/new', (req, res) => {
  res.redirect(301, '/register');
});

/**
 * POST /students
 * Discontinued legacy route: returns 410 Gone explaining registrar verification requirement (C5).
 */
router.post('/', (req, res) => {
  res.status(410).render('error', {
    status: 410,
    title: '410 — Registration Method Discontinued',
    message: 'Direct profile creation without registrar verification is no longer supported. Please register via the two-step verification portal at /register.'
  });
});

/**
 * GET /students/:id
 * Displays the sanitized student profile and their filed lost & found property tags.
 * Privacy rule: Exposes name, department, and registration timestamp only.
 * Private contact numbers, institutional emails, and USNs are never rendered publicly (C7).
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  // Strict ObjectId format verification
  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'That student reference is not a valid identifier.'
    });
  }

  try {
    // Select only public profile fields: name, department, createdAt
    const student = await Student.findById(id).select('fullName department createdAt isVerified');
    if (!student || !student.isVerified) {
      return res.status(404).render('404', {
        message: 'No verified student profile was found with that reference.'
      });
    }

    const [lostItems, foundItems] = await Promise.all([
      LostItem.find({ reportedBy: student._id })
        .populate('reportedBy', 'fullName department')
        .sort({ createdAt: -1 }),
      FoundItem.find({ reportedBy: student._id })
        .populate('reportedBy', 'fullName department')
        .sort({ createdAt: -1 })
    ]);

    res.render('student-profile', {
      currentPath: `/students/${id}`,
      student,
      lostItems,
      foundItems
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
