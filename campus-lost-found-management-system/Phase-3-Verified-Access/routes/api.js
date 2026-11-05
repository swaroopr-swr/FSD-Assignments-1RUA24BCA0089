const express = require('express');
const router = express.Router();

const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const Claim = require('../models/Claim');
const Student = require('../models/Student');
const CATEGORIES = require('../utils/categories');
const { isValidObjectId, escapeRegex, validateItem, validateClaim } = require('../utils/validators');

/**
 * RESTful JSON API Router for Component-5 React Frontend
 * Provides JSON endpoints for items, claims, students, metrics, and auth simulation.
 */

// GET /api/categories - Returns allowed item categories
router.get('/categories', (req, res) => {
  res.json({ categories: CATEGORIES });
});

// GET /api/stats - Metric counts for overview banner
router.get('/stats', async (req, res) => {
  try {
    const [foundCount, lostCount, returnedCount, pendingClaimsCount] = await Promise.all([
      FoundItem.countDocuments({}),
      LostItem.countDocuments({}),
      FoundItem.countDocuments({ status: 'Returned' }),
      Claim.countDocuments({ status: 'Pending' })
    ]);

    res.json({
      foundCount,
      lostCount,
      returnedCount,
      pendingClaimsCount,
      totalItems: foundCount + lostCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve ledger metrics' });
  }
});

// GET /api/students - Returns list of registered students for identity switcher
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}).select('fullName department usn email contactNumber');
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve student directory' });
  }
});

// GET /api/auth/me - Current simulated or cookie student session
router.get('/auth/me', (req, res) => {
  if (req.currentStudent) {
    return res.json({
      authenticated: true,
      student: {
        _id: req.currentStudent._id,
        fullName: req.currentStudent.fullName,
        usn: req.currentStudent.usn,
        email: req.currentStudent.email,
        department: req.currentStudent.department,
        contactNumber: req.currentStudent.contactNumber
      }
    });
  }
  res.json({ authenticated: false, student: null });
});

// POST /api/auth/switch - Switch active student session for easy testing
router.post('/auth/switch', async (req, res) => {
  const { studentId } = req.body;
  if (!studentId || !isValidObjectId(studentId)) {
    return res.status(400).json({ error: 'Valid student ID is required' });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.cookie('studentId', student._id.toString(), {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: `Active identity switched to ${student.fullName}`,
      student: {
        _id: student._id,
        fullName: student.fullName,
        usn: student.usn,
        email: student.email,
        department: student.department
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to switch student identity' });
  }
});

// GET /api/items - Consolidated query of found and lost property with filtering
router.get('/items', async (req, res) => {
  try {
    const { type = 'all', status, category, q } = req.query;

    const queryFilter = {};

    if (category && CATEGORIES.includes(category)) {
      queryFilter.category = category;
    }

    if (q && typeof q === 'string') {
      const safe = new RegExp(escapeRegex(q.trim()), 'i');
      queryFilter.$or = [{ itemName: safe }, { description: safe }];
    }

    let foundItems = [];
    let lostItems = [];

    if (type === 'all' || type === 'found') {
      const foundFilter = { ...queryFilter };
      if (status && ['Available', 'Returned'].includes(status)) {
        foundFilter.status = status;
      }
      foundItems = await FoundItem.find(foundFilter)
        .populate('reportedBy', 'fullName department usn')
        .sort({ createdAt: -1 });
    }

    if (type === 'all' || type === 'lost') {
      const lostFilter = { ...queryFilter };
      if (status && ['Lost', 'Resolved'].includes(status)) {
        lostFilter.status = status;
      }
      lostItems = await LostItem.find(lostFilter)
        .populate('reportedBy', 'fullName department usn')
        .sort({ createdAt: -1 });
    }

    // Format uniform item output
    const formattedFound = foundItems.map((item) => ({
      _id: item._id,
      itemType: 'found',
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      location: item.foundLocation,
      date: item.dateFound,
      status: item.status,
      reportedBy: item.reportedBy,
      createdAt: item.createdAt
    }));

    const formattedLost = lostItems.map((item) => ({
      _id: item._id,
      itemType: 'lost',
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      location: item.lastSeenLocation,
      date: item.dateLost,
      status: item.status,
      reportedBy: item.reportedBy,
      createdAt: item.createdAt
    }));

    const combined = [...formattedFound, ...formattedLost].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ items: combined });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items ledger' });
  }
});

// GET /api/items/:id - Specific item case file and related claims
router.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: 'Invalid reference identifier' });
  }

  try {
    let item = await FoundItem.findById(id).populate('reportedBy', 'fullName department usn contactNumber');
    let itemType = 'found';

    if (!item) {
      item = await LostItem.findById(id).populate('reportedBy', 'fullName department usn contactNumber');
      itemType = 'lost';
    }

    if (!item) {
      return res.status(404).json({ error: 'Property record not discovered' });
    }

    let claims = [];
    let isFinder = false;

    if (itemType === 'found') {
      isFinder = Boolean(
        req.currentStudent &&
        item.reportedBy &&
        item.reportedBy._id.toString() === req.currentStudent._id.toString()
      );

      if (isFinder) {
        // Finder sees full ledger
        const rawClaims = await Claim.find({ foundItem: item._id })
          .populate('claimedBy', 'fullName department usn email contactNumber')
          .sort({ createdAt: -1 });

        claims = rawClaims.map((c) => {
          const obj = c.toObject();
          // Hide contact number if not approved
          if (obj.status !== 'Approved' && obj.claimedBy) {
            delete obj.claimedBy.contactNumber;
            delete obj.claimedBy.email;
          }
          return obj;
        });
      } else if (req.currentStudent) {
        // Non-finder claimant sees only their own claim
        const userClaim = await Claim.findOne({
          foundItem: item._id,
          claimedBy: req.currentStudent._id
        }).populate('claimedBy', 'fullName department usn');

        if (userClaim) {
          claims = [userClaim];
        }
      }
    }

    res.json({
      item: {
        _id: item._id,
        itemType,
        itemName: item.itemName,
        category: item.category,
        description: item.description,
        location: itemType === 'found' ? item.foundLocation : item.lastSeenLocation,
        date: itemType === 'found' ? item.dateFound : item.dateLost,
        status: item.status,
        reportedBy: item.reportedBy,
        createdAt: item.createdAt
      },
      isFinder,
      claims
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve item case file' });
  }
});

// POST /api/items - Report a new Lost or Found item
router.post('/items', async (req, res) => {
  if (!req.currentStudent) {
    return res.status(401).json({ error: 'Authentication required. Please select or sign in as a student.' });
  }

  const { itemType, itemName, category, description, location, date } = req.body;
  const isLost = itemType === 'lost';

  const formData = {
    itemName,
    category,
    description,
    [isLost ? 'lastSeenLocation' : 'foundLocation']: location,
    [isLost ? 'dateLost' : 'dateFound']: date
  };

  const errors = validateItem(formData, isLost);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', fields: errors });
  }

  try {
    let createdItem;
    if (isLost) {
      createdItem = new LostItem({
        itemName: itemName.trim(),
        category: category.trim(),
        description: description.trim(),
        lastSeenLocation: location.trim(),
        dateLost: new Date(date),
        reportedBy: req.currentStudent._id
      });
    } else {
      createdItem = new FoundItem({
        itemName: itemName.trim(),
        category: category.trim(),
        description: description.trim(),
        foundLocation: location.trim(),
        dateFound: new Date(date),
        reportedBy: req.currentStudent._id
      });
    }

    await createdItem.save();
    res.status(201).json({
      success: true,
      message: `${isLost ? 'Lost' : 'Found'} item record lodged successfully.`,
      item: createdItem
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record item in registry' });
  }
});

// POST /api/items/:id/claims - Lodge an ownership claim slip
router.post('/items/:id/claims', async (req, res) => {
  if (!req.currentStudent) {
    return res.status(401).json({ error: 'Authentication required to submit a claim.' });
  }

  const { id } = req.params;
  const { reason } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: 'Invalid found item reference' });
  }

  const claimErrors = validateClaim({ reason });
  if (Object.keys(claimErrors).length > 0) {
    return res.status(400).json({ error: claimErrors.reason });
  }

  try {
    const item = await FoundItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Found item does not exist in custody' });
    }

    if (item.status === 'Returned') {
      return res.status(409).json({ error: 'This item has already been marked as Returned. No new claims allowed.' });
    }

    if (item.reportedBy.toString() === req.currentStudent._id.toString()) {
      return res.status(403).json({ error: 'Self-claim prohibited: You reported finding this item.' });
    }

    const existingClaim = await Claim.findOne({
      foundItem: item._id,
      claimedBy: req.currentStudent._id
    });

    if (existingClaim) {
      return res.status(409).json({ error: 'You have already submitted a claim for this item.' });
    }

    const claim = new Claim({
      foundItem: item._id,
      claimedBy: req.currentStudent._id,
      reason: reason.trim(),
      status: 'Pending'
    });

    await claim.save();
    res.status(201).json({
      success: true,
      message: 'Claim slip submitted. The finder will review your stated proof.',
      claim
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already submitted a claim for this item.' });
    }
    res.status(500).json({ error: 'Failed to record claim' });
  }
});

// PATCH /api/claims/:id/status - Approve or Reject a claim
router.patch('/claims/:id/status', async (req, res) => {
  if (!req.currentStudent) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: 'Invalid claim identifier' });
  }

  if (status !== 'Approved' && status !== 'Rejected') {
    return res.status(400).json({ error: 'Decision must be strictly "Approved" or "Rejected"' });
  }

  try {
    const claim = await Claim.findById(id).populate('foundItem');
    if (!claim) {
      return res.status(404).json({ error: 'Claim record not found' });
    }

    // Ownership check: Only finder can decide
    if (!claim.foundItem || claim.foundItem.reportedBy.toString() !== req.currentStudent._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: Only the finder who logged this item may decide claims.' });
    }

    if (claim.status !== 'Pending') {
      return res.status(409).json({ error: 'This claim has already been decided.' });
    }

    const reviewedAt = new Date();

    if (status === 'Approved') {
      // 1. Mark claim approved
      const updatedClaim = await Claim.findOneAndUpdate(
        { _id: claim._id, status: 'Pending' },
        { $set: { status: 'Approved', reviewedAt } },
        { new: true }
      );

      if (!updatedClaim) {
        return res.status(409).json({ error: 'Claim state conflict: no longer pending.' });
      }

      // 2. Mark item returned
      const updatedItem = await FoundItem.findOneAndUpdate(
        { _id: claim.foundItem._id, status: 'Available' },
        { $set: { status: 'Returned' } },
        { new: true }
      );

      if (!updatedItem) {
        // Rollback
        await Claim.updateOne({ _id: claim._id }, { $set: { status: 'Pending', reviewedAt: null } });
        return res.status(409).json({ error: 'Item is already Returned.' });
      }

      // 3. Auto-reject other pending claims
      await Claim.updateMany(
        { foundItem: claim.foundItem._id, status: 'Pending', _id: { $ne: claim._id } },
        { $set: { status: 'Rejected', reviewedAt } }
      );

      return res.json({
        success: true,
        message: 'Claim Approved. Item marked as Returned and competing claims rejected.',
        claim: updatedClaim
      });
    }

    if (status === 'Rejected') {
      const updatedClaim = await Claim.findOneAndUpdate(
        { _id: claim._id, status: 'Pending' },
        { $set: { status: 'Rejected', reviewedAt } },
        { new: true }
      );

      return res.json({
        success: true,
        message: 'Claim marked as Rejected.',
        claim: updatedClaim
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update claim decision' });
  }
});

module.exports = router;
