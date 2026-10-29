const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { isBlank, isValidEmail } = require('../utils/validators');

/**
 * GET /sign-in
 * Renders the sign-in form.
 */
router.get('/sign-in', (req, res) => {
  res.render('sign-in', {
    currentPath: '/sign-in',
    errors: {},
    values: {}
  });
});

/**
 * POST /sign-in
 * Signs a student in using their college email address via a signed cookie.
 */
router.post('/sign-in', async (req, res, next) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const errors = {};

  if (isBlank(email)) {
    errors.email = 'Please enter your college email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email format.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('sign-in', {
      currentPath: '/sign-in',
      errors,
      values: { email }
    });
  }

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      errors.email = 'No student profile found with that email address. Please create a profile.';
      return res.status(400).render('sign-in', {
        currentPath: '/sign-in',
        errors,
        values: { email }
      });
    }

    // Set signed httpOnly cookie for session tracking
    res.cookie('studentId', student._id.toString(), {
      signed: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    req.flash('success', `Signed in as ${student.fullName}. Welcome to the Property Office.`);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /sign-out
 * Clears the session cookie and redirects home.
 */
router.post('/sign-out', (req, res) => {
  res.clearCookie('studentId');
  req.flash('notice', 'You have been signed out from the Property Office.');
  res.redirect('/');
});

module.exports = router;
