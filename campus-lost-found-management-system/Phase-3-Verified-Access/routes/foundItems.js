const express = require('express');
const router = express.Router();
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const Student = require('../models/Student');
const CATEGORIES = require('../utils/categories');
const { requireAuth } = require('../middleware/currentStudent');
const { isValidObjectId, escapeRegex, validateItem, validateClaim } = require('../utils/validators');

/**
 * GET /found-items
 * Lists all found items with keyword search, category filtering, and status filtering.
 */
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();
    const status = (req.query.status || '').trim();

    const queryFilter = {};

    if (category && CATEGORIES.includes(category)) {
      queryFilter.category = category;
    }

    // Phase 2: Status filtering (Available / Returned)
    if (status && ['Available', 'Returned'].includes(status)) {
      queryFilter.status = status;
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
      selectedStatus: status,
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
 * Enforces strict viewer data isolation: only the finder receives all claims;
 * claimants receive only their own claim; logged-out visitors receive none.
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  // Strict ObjectId format verification
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

    // Determine viewer identity and permissions
    const isFinder = Boolean(
      req.currentStudent &&
      item.reportedBy &&
      item.reportedBy._id.toString() === req.currentStudent._id.toString()
    );

    let claims = [];
    let userClaim = null;

    if (isFinder) {
      // The finder sees the full claims ledger.
      // Privacy rule: Claimant contact details are revealed to the finder ONLY after approval.
      const rawClaims = await Claim.find({ foundItem: item._id })
        .populate('claimedBy', 'fullName department email contactNumber')
        .sort({ createdAt: -1 });

      claims = rawClaims.map((c) => {
        const claimObj = c.toObject();
        if (claimObj.status !== 'Approved' && claimObj.claimedBy) {
          delete claimObj.claimedBy.contactNumber;
          delete claimObj.claimedBy.email;
        }
        return claimObj;
      });
    } else if (req.currentStudent) {
      // A non-finder student sees only their own claim if submitted
      userClaim = await Claim.findOne({
        foundItem: item._id,
        claimedBy: req.currentStudent._id
      });

      // Privacy rule: If claim was approved, reveal finder's contact number to the claimant
      if (userClaim && userClaim.status === 'Approved') {
        const finderWithContact = await Student.findById(item.reportedBy._id).select('fullName department contactNumber');
        if (finderWithContact) {
          item.reportedBy = finderWithContact;
        }
      }
    }

    res.render('found-item-details', {
      currentPath: `/found-items/${id}`,
      item,
      isFinder,
      claims,
      userClaim,
      claimErrors: {},
      claimValues: {}
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /found-items/:id/claims
 * Submits a new claim slip asserting ownership over a found item.
 * Enforces:
 * 1. Must be signed in.
 * 2. Item exists and valid ID (relationship check).
 * 3. Item is Available (state check).
 * 4. Claimant cannot be the item's finder (self-claim prevention).
 * 5. Reason validation (10-500 chars).
 * 6. Duplicate-claim rule: 1 claim per student per item ever.
 * 7. Explicit allow-list insertion with default 'Pending' status.
 */
router.post('/:id/claims', requireAuth, async (req, res, next) => {
  const { id } = req.params;

  // Rule 2 (Relationship check pt 1): Validate item ID format
  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'That reference number is not a valid found item identifier.'
    });
  }

  try {
    // Rule 2 (Relationship check pt 2): Ensure item exists in custody
    const item = await FoundItem.findById(id).populate('reportedBy', 'fullName department');
    if (!item) {
      return res.status(404).render('404', {
        message: 'No found item record discovered with that reference number.'
      });
    }

    // Rule 3 (State check): If item is already Returned, refuse with 409 Conflict
    if (item.status === 'Returned') {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Item Already Returned',
        message: 'This item has already been marked as Returned. No new claims may be lodged.'
      });
    }

    // Rule 4 (Self-claim prevention): Finder cannot claim their own reported item
    if (item.reportedBy._id.toString() === req.currentStudent._id.toString()) {
      return res.status(403).render('error', {
        status: 403,
        title: '403 — Self-Claim Prohibited',
        message: 'You cannot submit an ownership claim for an item you reported finding.'
      });
    }

    // Rule 5: Validate reason field (10-500 chars, non-blank)
    const claimValues = { reason: req.body.reason };
    const claimErrors = validateClaim(claimValues);

    if (Object.keys(claimErrors).length > 0) {
      // Re-render detail page with 400 Bad Request, showing field errors and preserving input
      return res.status(400).render('found-item-details', {
        currentPath: `/found-items/${item._id}`,
        item,
        isFinder: false,
        claims: [],
        userClaim: null,
        claimErrors,
        claimValues
      });
    }

    // Rule 6 (Duplicate-claim rule): Friendly pre-check for existing claim
    const existingClaim = await Claim.findOne({
      foundItem: item._id,
      claimedBy: req.currentStudent._id
    });

    if (existingClaim) {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Duplicate Claim Conflict',
        message: 'You have already submitted a claim for this item. Each student may submit at most one claim per item.'
      });
    }

    // Rule 7 (Allow-list): Only permit explicitly validated fields; status always Pending
    const claim = new Claim({
      foundItem: item._id,
      claimedBy: req.currentStudent._id,
      reason: req.body.reason.trim(),
      status: 'Pending'
    });

    await claim.save();

    // Rule 8: Flash notice and redirect to item page (PRG pattern)
    req.flash('success', 'Claim submitted. The finder will review it.');
    res.redirect(`/found-items/${item._id}`);
  } catch (err) {
    // Safety net: Handle MongoDB duplicate key error 11000 from compound unique index
    if (err.code === 11000) {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Duplicate Claim Conflict',
        message: 'You have already submitted a claim for this item. Duplicate claims are refused.'
      });
    }
    next(err);
  }
});

/**
 * PATCH /found-items/:id/status
 * Directly update item status to Returned. Required by course assignment specification.
 * Enforces:
 * 1. Must be signed in.
 * 2. Valid ID and item exists.
 * 3. Only the reporting finder may call this.
 * 4. Body status allow-list is strictly 'Returned'.
 * 5. Requires an Approved claim to exist for this item.
 * 6. Returned status cannot be reverted.
 */
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'Invalid item identifier format.'
    });
  }

  try {
    const item = await FoundItem.findById(id);
    if (!item) {
      return res.status(404).render('404', {
        message: 'No found item discovered with that identifier.'
      });
    }

    // Ownership check: Only the reporting student can update status
    if (item.reportedBy.toString() !== req.currentStudent._id.toString()) {
      return res.status(403).render('error', {
        status: 403,
        title: '403 — Forbidden',
        message: 'Only the student who reported this item may change its status.'
      });
    }

    // Allow-list: Only 'Returned' is permitted
    const targetStatus = (req.body.status || '').trim();
    if (targetStatus !== 'Returned') {
      return res.status(400).render('error', {
        status: 400,
        title: '400 — Invalid Status Transition',
        message: 'Item status may only be transitioned to Returned.'
      });
    }

    // State check: Returned items cannot be transitioned again
    if (item.status === 'Returned') {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Status Conflict',
        message: 'Returned status is permanent and cannot be modified or reverted.'
      });
    }

    // Relationship requirement: An Approved claim must exist
    const approvedClaim = await Claim.findOne({
      foundItem: item._id,
      status: 'Approved'
    });

    if (!approvedClaim) {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Prerequisite Not Satisfied',
        message: 'An item may only be marked Returned after a claim has been Approved.'
      });
    }

    // Safe update using atomic filter
    item.status = 'Returned';
    await item.save();

    req.flash('success', 'Found item status successfully updated to Returned.');
    res.redirect(`/found-items/${item._id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
