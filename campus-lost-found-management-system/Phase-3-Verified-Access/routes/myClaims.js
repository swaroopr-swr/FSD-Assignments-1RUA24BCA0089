const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const { requireAuth } = require('../middleware/currentStudent');

/**
 * GET /my-claims
 * Personal dashboard displaying all claim slips filed by the signed-in student.
 * Supports status filtering: ?status=Pending | Approved | Rejected | All
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const selectedStatus = (req.query.status || '').trim();
    const validStatuses = ['Pending', 'Approved', 'Rejected'];

    const filter = { claimedBy: req.currentStudent._id };

    if (validStatuses.includes(selectedStatus)) {
      filter.status = selectedStatus;
    }

    const claims = await Claim.find(filter)
      .populate('foundItem')
      .sort({ createdAt: -1 });

    res.render('my-claims', {
      currentPath: '/my-claims',
      claims,
      selectedStatus: validStatuses.includes(selectedStatus) ? selectedStatus : '',
      validStatuses
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
