const express = require('express');
const router = express.Router();

const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const { requireVerifiedStudent } = require('../middleware/currentStudent');

/**
 * GET /dashboard
 * Personal command console for verified students.
 * 
 * Displays:
 * 1. Verified identity badge, USN, and department
 * 2. Activity metrics: counts of own lost items, found items, and submitted claims
 * 3. Private contact info: student's own mobile number is visible ONLY here
 * 4. "Claims awaiting your decision": pending claims filed on Available items reported by this student
 *    (linking to item page where decisions are made)
 */
router.get('/', requireVerifiedStudent, async (req, res, next) => {
  try {
    const student = req.currentStudent;

    // Aggregate counts of student's filing activity
    const [lostCount, foundCount, claimsCount] = await Promise.all([
      LostItem.countDocuments({ reportedBy: student._id }),
      FoundItem.countDocuments({ reportedBy: student._id }),
      Claim.countDocuments({ claimedBy: student._id })
    ]);

    // Find all Available found items reported by this student
    const myAvailableItems = await FoundItem.find({
      reportedBy: student._id,
      status: 'Available'
    }).select('_id itemName category foundLocation');

    const itemIds = myAvailableItems.map((item) => item._id);

    // Locate pending claims awaiting this student's decision
    const pendingClaims = await Claim.find({
      foundItem: { $in: itemIds },
      status: 'Pending'
    })
      .populate('foundItem', 'itemName category foundLocation')
      .populate('claimedBy', 'fullName department')
      .sort({ createdAt: -1 });

    res.render('dashboard', {
      currentPath: '/dashboard',
      student,
      metrics: {
        lostCount,
        foundCount,
        claimsCount
      },
      pendingClaims
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
