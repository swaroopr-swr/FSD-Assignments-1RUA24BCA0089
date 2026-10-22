const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const CATEGORIES = require('../utils/categories');
const { requireAuth } = require('../middleware/currentStudent');
const { isValidObjectId, escapeRegex, validateItem } = require('../utils/validators');

/**
 * GET /lost-items
 * Lists all lost items with optional keyword search and category filtering.
 */
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const queryFilter = {};

    // Filter by category if specified and recognized
    if (category && CATEGORIES.includes(category)) {
      queryFilter.category = category;
    }

    // Keyword search over itemName or lastSeenLocation using safe regex escaping
    if (q) {
      const safeRegex = new RegExp(escapeRegex(q), 'i');
      queryFilter.$or = [
        { itemName: safeRegex },
        { lastSeenLocation: safeRegex }
      ];
    }

    const items = await LostItem.find(queryFilter)
      .populate('reportedBy', 'fullName department')
      .sort({ createdAt: -1 });

    res.render('lost-items', {
      currentPath: '/lost-items',
      items,
      categories: CATEGORIES,
      selectedCategory: category,
      q
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /lost-items/new
 * Renders the notice of loss filing form.
 * Enforces authentication so anonymous users cannot file reports.
 * NOTE: Registered before /:id so Express does not treat "new" as an item ID.
 */
router.get('/new', requireAuth, (req, res) => {
  res.render('lost-item-new', {
    currentPath: '/lost-items/new',
    categories: CATEGORIES,
    errors: {},
    values: {}
  });
});

/**
 * POST /lost-items
 * Validates and records a new lost item filing slip.
 * Discards any reportedBy or status from the request body to enforce ownership.
 */
router.post('/', requireAuth, async (req, res, next) => {
  // Allow-list fields from body
  const values = {
    itemName: req.body.itemName,
    category: req.body.category,
    description: req.body.description,
    lastSeenLocation: req.body.lastSeenLocation,
    dateLost: req.body.dateLost
  };

  const errors = validateItem(values, true);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('lost-item-new', {
      currentPath: '/lost-items/new',
      categories: CATEGORIES,
      errors,
      values
    });
  }

  try {
    const lostItem = new LostItem({
      itemName: values.itemName.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      lastSeenLocation: values.lastSeenLocation.trim(),
      dateLost: new Date(values.dateLost),
      status: 'Lost',
      // Ownership strictly bound to the authenticated student session
      reportedBy: req.currentStudent._id
    });

    await lostItem.save();

    const ref = 'LF-' + lostItem._id.toString().slice(-6).toUpperCase();
    req.flash('success', `Lost item report filed successfully. Assigned reference: ${ref}.`);
    res.redirect(`/lost-items/${lostItem._id}`);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /lost-items/:id
 * Displays the detailed property case file for a lost item.
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'That reference number is not a valid lost item identifier.'
    });
  }

  try {
    const item = await LostItem.findById(id).populate('reportedBy', 'fullName department');
    if (!item) {
      return res.status(404).render('404', {
        message: 'No lost item report found with that reference number.'
      });
    }

    res.render('lost-item-details', {
      currentPath: `/lost-items/${id}`,
      item
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
