const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { isRvuEmail, isBlank } = require('../utils/validators');
const { verifyPassword, DUMMY_PASSWORD_HASH } = require('../utils/passwords');

// Dual-counter rate limiting on sign-in (C4): 20/IP/15m, 5/IP+email/15m
const signInLimiter = createRateLimiter({
  endpointName: 'student-signin',
  ipMax: 20,
  ipWindowMs: 15 * 60 * 1000,
  ipEmailMax: 5,
  ipEmailWindowMs: 15 * 60 * 1000
});

/**
 * GET /sign-in
 * Renders the student authentication form.
 */
router.get('/sign-in', (req, res) => {
  if (req.currentStudent && req.currentStudent.isVerified) {
    return res.redirect('/dashboard');
  }
  res.render('sign-in', {
    currentPath: '/sign-in',
    errors: {},
    values: {}
  });
});

/**
 * POST /sign-in
 * Authenticates verified student using institutional email and scrypt password.
 * Enforces constant-time-ish authentication comparison (C3) and generic error responses.
 */
router.post('/sign-in', signInLimiter, async (req, res, next) => {
  const rawEmail = req.body.email;
  const rawPassword = req.body.password;

  // Strict string guard (C6)
  if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string') {
    return res.status(400).render('sign-in', {
      currentPath: '/sign-in',
      errors: { form: 'Invalid college email or password.' },
      values: {}
    });
  }

  const email = rawEmail.trim().toLowerCase();
  const password = rawPassword;

  // Basic validation check
  if (isBlank(email) || !isRvuEmail(email) || isBlank(password)) {
    // Run dummy comparison to keep response time consistent
    await verifyPassword(password || 'dummy', DUMMY_PASSWORD_HASH);
    return res.status(400).render('sign-in', {
      currentPath: '/sign-in',
      errors: { form: 'Invalid college email or password.' },
      values: { email }
    });
  }

  try {
    // Explicitly select passwordHash which has select: false by default (C7)
    const student = await Student.findOne({ email }).select('+passwordHash');

    // Always run scrypt comparison: against real hash if student found, or dummy hash if not (C3)
    const hashToCompare = student ? student.passwordHash : DUMMY_PASSWORD_HASH;
    const isPasswordValid = await verifyPassword(password, hashToCompare);

    if (!student || !isPasswordValid || !student.isVerified) {
      return res.status(400).render('sign-in', {
        currentPath: '/sign-in',
        errors: { form: 'Invalid college email or password.' },
        values: { email }
      });
    }

    // Set signed httpOnly cookie for session tracking
    res.cookie('studentId', student._id.toString(), {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    req.flash('success', `Signed in as ${student.fullName}. Welcome to the Property Office.`);
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /sign-out
 * Destroys the student session cookie and redirects to public home.
 */
router.post('/sign-out', (req, res) => {
  res.clearCookie('studentId');
  req.flash('notice', 'You have been signed out from the Property Office.');
  res.redirect('/');
});

module.exports = router;
