const express = require('express');
const router = express.Router();
const FoundItem = require('../models/FoundItem');
const CATEGORIES = require('../utils/categories');
const { requireAuth } = require('../middleware/currentStudent');
const { isValidObjectId, escapeRegex, validateItem } = require('../utils/validators');

/**
 * GET /found-items
 * Lists all found items with keyword search and category filtering.
 */
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const queryFilter = {};

    if (category && CATEGORIES.includes(category)) {
      queryFilter.category = category;
    }

    if (q) {
      const safeRegex = new RegExp(escapeRegex(q), 'i');
      queryFilter.$or = [
        { itemName: safeRegex },
        { foundLocation: safeRegex }
      ];
    }

    const items = await FoundItem.find(queryFilter)
      .populate('reportedBy', 'fullName department')
      .sort({ createdAt: -1 });

    res.render('found-items', {
      currentPath: '/found-items',
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
 * GET /found-items/new
 * Renders the notice of discovery filing form.
 * Enforces authentication so anonymous visitors cannot lodge records.
 * Registered before /:id so Express resolves "new" properly.
 */
router.get('/new', requireAuth, (req, res) => {
  res.render('found-item-new', {
    currentPath: '/found-items/new',
    categories: CATEGORIES,
    errors: {},
    values: {}
  });
});

/**
 * POST /found-items
 * Validates and records a newly found article.
 * Enforces authenticated student ownership via signed session cookie.
 */
router.post('/', requireAuth, async (req, res, next) => {
  const values = {
    itemName: req.body.itemName,
    category: req.body.category,
    description: req.body.description,
    foundLocation: req.body.foundLocation,
    dateFound: req.body.dateFound
  };

  const errors = validateItem(values, false);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('found-item-new', {
      currentPath: '/found-items/new',
      categories: CATEGORIES,
      errors,
      values
    });
  }

  try {
    const foundItem = new FoundItem({
      itemName: values.itemName.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      foundLocation: values.foundLocation.trim(),
      dateFound: new Date(values.dateFound),
      status: 'Available',
      reportedBy: req.currentStudent._id
    });

    await foundItem.save();

    const ref = 'LF-' + foundItem._id.toString().slice(-6).toUpperCase();
    req.flash('success', `Found item logged successfully. Assigned reference: ${ref}.`);
    res.redirect(`/found-items/${foundItem._id}`);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /found-items/:id
 * Displays the detailed property case file for a found article.
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'That reference number is not a valid found item identifier.'
    });
  }

  try {
    const item = await FoundItem.findById(id).populate('reportedBy', 'fullName department');
    if (!item) {
      return res.status(404).render('404', {
        message: 'No found item record discovered with that reference number.'
      });
    }

    res.render('found-item-details', {
      currentPath: `/found-items/${id}`,
      item
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
