const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { isValidObjectId, validateStudent } = require('../utils/validators');

/**
 * GET /students/new
 * Renders the new student registration slip.
 */
router.get('/new', (req, res) => {
  res.render('student-new', {
    currentPath: '/students/new',
    errors: {},
    values: {}
  });
});

/**
 * POST /students
 * Creates a new student record and signs the student in.
 */
router.post('/', async (req, res, next) => {
  const values = {
    fullName: req.body.fullName,
    email: req.body.email,
    department: req.body.department,
    contactNumber: req.body.contactNumber
  };

  const errors = validateStudent(values);

  // Check for duplicate email before save
  if (!errors.email && values.email) {
    try {
      const existing = await Student.findOne({ email: values.email.trim().toLowerCase() });
      if (existing) {
        errors.email = 'A student profile is already registered with this email address.';
      }
    } catch (err) {
      return next(err);
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('student-new', {
      currentPath: '/students/new',
      errors,
      values
    });
  }

  try {
    const student = new Student({
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      department: values.department.trim(),
      contactNumber: values.contactNumber.trim()
    });

    await student.save();

    // Automatically sign in the newly registered student
    res.cookie('studentId', student._id.toString(), {
      signed: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    req.flash('success', `Student profile registered successfully for ${student.fullName}.`);
    res.redirect(`/students/${student._id}`);
  } catch (err) {
    // Catch MongoDB duplicate key error (E11000) as safety fallback
    if (err.code === 11000) {
      return res.status(400).render('student-new', {
        currentPath: '/students/new',
        errors: { email: 'A student profile is already registered with this email address.' },
        values
      });
    }
    next(err);
  }
});

/**
 * GET /students/:id
 * Displays the student's profile dossier and all lost & found items filed by them.
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
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).render('404', {
        message: 'No student profile was found with that reference.'
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
