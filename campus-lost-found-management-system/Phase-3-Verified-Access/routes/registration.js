const express = require('express');
const router = express.Router();

const RosterEntry = require('../models/RosterEntry');
const Student = require('../models/Student');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { isRvuEmail, isValidUsn, isValidPhone, isValidPassword } = require('../utils/validators');
const { hashPassword } = require('../utils/passwords');

// Rate limiting for Step 1 verification: 10 attempts per IP per 15 min window (C4)
const verifyLimiter = createRateLimiter({
  endpointName: 'register-verify',
  ipMax: 10,
  ipWindowMs: 15 * 60 * 1000,
  ipEmailMax: 0
});

/**
 * Helper to inspect and validate signed registration ticket cookie.
 */
async function parseValidTicket(req) {
  const raw = req.signedCookies?.regTicket;
  if (!raw || typeof raw !== 'string') return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.purpose !== 'reg-ticket' ||
      typeof parsed.rosterId !== 'string' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Date.now()
    ) {
      return null;
    }

    const roster = await RosterEntry.findById(parsed.rosterId);
    if (!roster || roster.isRegistered) return null;

    return { ticket: parsed, roster };
  } catch {
    return null;
  }
}

/**
 * GET /register
 * Entry point for two-step student registration.
 */
router.get('/', async (req, res, next) => {
  // If already signed in as verified student, redirect to dashboard
  if (req.currentStudent && req.currentStudent.isVerified) {
    return res.redirect('/dashboard');
  }

  // Check if student already holds a valid, unexpired Step 1 ticket
  const ticketData = await parseValidTicket(req);
  if (ticketData) {
    return res.render('register-step2', {
      currentPath: '/register',
      roster: ticketData.roster,
      errors: {},
      values: {}
    });
  }

  res.render('register-step1', {
    currentPath: '/register',
    errors: {},
    values: {}
  });
});

/**
 * POST /register/verify
 * Step 1: Validates student institutional email and USN against registrar roster.
 */
router.post('/verify', verifyLimiter, async (req, res, next) => {
  const rawEmail = req.body.email;
  const rawUsn = req.body.usn;

  // Strict string guard: reject non-string types or arrays (C5, C6)
  if (typeof rawEmail !== 'string' || typeof rawUsn !== 'string') {
    return res.status(400).render('register-step1', {
      currentPath: '/register',
      errors: { form: "We couldn't verify these details." },
      values: {}
    });
  }

  const email = rawEmail.trim().toLowerCase();
  const usn = rawUsn.trim().toUpperCase();

  // Validate format constraints
  if (!isRvuEmail(email) || !isValidUsn(usn)) {
    return res.status(400).render('register-step1', {
      currentPath: '/register',
      errors: { form: "We couldn't verify these details." },
      values: { email, usn }
    });
  }

  try {
    // Check registrar whitelist matching BOTH email and USN
    const roster = await RosterEntry.findOne({ email, usn });
    if (!roster) {
      return res.status(400).render('register-step1', {
        currentPath: '/register',
        errors: { form: "We couldn't verify these details." },
        values: { email, usn }
      });
    }

    // Check if account already registered for these details
    const existingStudent = await Student.findOne({
      $or: [{ usn: roster.usn }, { email: roster.email }]
    });

    if (roster.isRegistered || existingStudent) {
      return res.status(400).render('register-step1', {
        currentPath: '/register',
        errors: { form: 'An account already exists for these details. Please sign in.' },
        values: { email, usn }
      });
    }

    // Issue short-lived (10-minute), signed, single-use ticket cookie (C5)
    const ticketPayload = JSON.stringify({
      purpose: 'reg-ticket',
      rosterId: roster._id.toString(),
      exp: Date.now() + 10 * 60 * 1000
    });

    res.cookie('regTicket', ticketPayload, {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/register',
      maxAge: 10 * 60 * 1000
    });

    return res.render('register-step2', {
      currentPath: '/register',
      roster,
      errors: {},
      values: {}
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /register
 * Step 2: Finalizes student account creation using verified ticket for identity (C5).
 */
router.post('/', async (req, res, next) => {
  const ticketData = await parseValidTicket(req);
  if (!ticketData) {
    res.clearCookie('regTicket', { path: '/register' });
    req.flash('notice', 'Verification ticket expired or invalid. Please verify your details again.');
    return res.redirect('/register');
  }

  const { roster } = ticketData;
  const contactNumber = (req.body.contactNumber || '').trim();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const confirmPassword = typeof req.body.confirmPassword === 'string' ? req.body.confirmPassword : '';

  const errors = {};

  // Validate contact number
  if (!contactNumber) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!isValidPhone(contactNumber)) {
    errors.contactNumber = 'Contact number must be exactly 10 digits starting with 6, 7, 8, or 9.';
  }

  // Validate password constraints (8-128 chars, C12)
  if (!password) {
    errors.password = 'Password is required.';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be between 8 and 128 characters.';
  } else if (password === confirmPassword) {
    // Password must not match email or USN
    if (
      password.toLowerCase() === roster.email.toLowerCase() ||
      password.toUpperCase() === roster.usn.toUpperCase()
    ) {
      errors.password = 'Password must not match your email address or USN.';
    }
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('register-step2', {
      currentPath: '/register',
      roster,
      errors,
      values: { contactNumber }
    });
  }

  try {
    // Atomically claim the roster entry: prevents double-submit race condition (C5)
    const claimedRoster = await RosterEntry.findOneAndUpdate(
      { _id: roster._id, isRegistered: false },
      { $set: { isRegistered: true } },
      { new: true }
    );

    if (!claimedRoster) {
      res.clearCookie('regTicket', { path: '/register' });
      return res.status(400).render('register-step1', {
        currentPath: '/register',
        errors: { form: 'An account already exists for these details. Please sign in.' },
        values: {}
      });
    }

    // Hash password with async crypto.scrypt (C12)
    const passwordHash = await hashPassword(password);

    let student;
    try {
      student = new Student({
        fullName: roster.fullName,
        usn: roster.usn,
        email: roster.email,
        department: roster.department,
        contactNumber,
        passwordHash,
        isVerified: true,
        verifiedAt: new Date(),
        rosterEntry: roster._id
      });
      await student.save();

      // Record student reference on registrar roster entry
      await RosterEntry.updateOne({ _id: roster._id }, { $set: { student: student._id } });
    } catch (saveErr) {
      // Compensating action: release atomic claim if student save fails
      await RosterEntry.updateOne({ _id: roster._id }, { $set: { isRegistered: false, student: null } });
      throw saveErr;
    }

    // Invalidate single-use registration ticket
    res.clearCookie('regTicket', { path: '/register' });

    // Issue signed httpOnly session cookie
    res.cookie('studentId', student._id.toString(), {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    req.flash('success', `Registration complete. Welcome to the Property Office, ${student.fullName}.`);
    return res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
