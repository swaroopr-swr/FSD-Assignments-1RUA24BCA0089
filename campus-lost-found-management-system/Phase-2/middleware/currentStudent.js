const Student = require('../models/Student');
const { isValidObjectId } = require('../utils/validators');

/**
 * Middleware to load the currently authenticated student from signed cookies.
 * Attaches the student to both req.currentStudent and res.locals.currentStudent.
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
    if (!student) {
      // Student was deleted or does not exist
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
 * Route protection middleware.
 * Ensures an active student session exists before accessing reporting routes.
 */
function requireAuth(req, res, next) {
  if (!req.currentStudent) {
    req.flash('notice', 'Please sign in with your college email or create a profile to report an item.');
    return res.redirect('/sign-in');
  }
  next();
}

module.exports = {
  loadCurrentStudent,
  requireAuth
};
