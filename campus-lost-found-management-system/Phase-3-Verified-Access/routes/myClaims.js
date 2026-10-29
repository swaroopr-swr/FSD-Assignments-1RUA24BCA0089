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

    const rawClaims = await Claim.find(filter)
      .populate({
        path: 'foundItem',
        populate: {
          path: 'reportedBy',
          select: 'fullName department contactNumber'
        }
      })
      .sort({ createdAt: -1 });

    const claims = rawClaims.map((c) => {
      const claimObj = c.toObject();
      // Privacy rule: Only reveal finder contact details if the claim was approved
      if (claimObj.status !== 'Approved' && claimObj.foundItem && claimObj.foundItem.reportedBy) {
        delete claimObj.foundItem.reportedBy.contactNumber;
      }
      return claimObj;
    });

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
