const Student = require('../models/Student');
const { isValidObjectId } = require('../utils/validators');

/**
 * Middleware to load the currently authenticated verified student from signed cookies.
 * Attaches the student to both req.currentStudent and res.locals.currentStudent.
 * Note: passwordHash is configured with select: false in Student schema, so it is never
 * attached to req or res.locals (C7).
 */
async function loadCurrentStudent(req, res, next) {
  const studentId = req.signedCookies.studentId;

  if (!studentId) {
    res.locals.currentStudent = null;
    req.currentStudent = null;
    return next();
  }

  // If the cookie contains an invalid ObjectId, clear it safely
  if (!isValidObjectId(studentId)) {
    res.clearCookie('studentId');
    res.locals.currentStudent = null;
    req.currentStudent = null;
    return next();
  }

  try {
    const student = await Student.findById(studentId);
    if (!student || !student.isVerified) {
      // Student was deleted or is not verified
      res.clearCookie('studentId');
      res.locals.currentStudent = null;
      req.currentStudent = null;
    } else {
      res.locals.currentStudent = student;
      req.currentStudent = student;
    }
  } catch (err) {
    console.error('Error fetching student session:', err.message);
    res.clearCookie('studentId');
    res.locals.currentStudent = null;
    req.currentStudent = null;
  }

  next();
}

/**
 * Route protection middleware (C11).
 * Strictly requires an active, verified student session before accessing filing or claim actions.
 */
function requireVerifiedStudent(req, res, next) {
  if (!req.currentStudent || !req.currentStudent.isVerified) {
    req.flash('notice', 'Please sign in with your verified college account to proceed.');
    return res.redirect('/sign-in');
  }
  next();
}

module.exports = {
  loadCurrentStudent,
  requireVerifiedStudent,
  requireAuth: requireVerifiedStudent // Backward compatible alias
};
