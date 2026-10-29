const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');
const { requireAuth } = require('../middleware/currentStudent');
const { isValidObjectId } = require('../utils/validators');

/**
 * PATCH /claims/:id/status
 * Approves or rejects an ownership claim slip.
 * Enforces:
 * 1. Must be signed in.
 * 2. Valid claim ID & claim document exists (with foundItem populated).
 * 3. Body status allow-list: strictly 'Approved' or 'Rejected'.
 * 4. Ownership check: Only the student who reported the found item can review claims.
 * 5. State check: Only 'Pending' claims can be decided; decided claims cannot be changed (409).
 * 6. Safe update: Use $set for status and reviewedAt only.
 * 7. Ordered atomic updates:
 *    - Update claim to Approved if still Pending.
 *    - Update item to Returned if still Available; if already Returned, revert claim to Pending.
 *    - Atomically reject any other pending claims on this item.
 *    (Standalone MongoDB instances do not support multi-document replica set transactions,
 *     so we enforce concurrency safety through atomic conditional filters and rollback).
 * 8. Reject path: Update single claim to Rejected.
 */
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  const { id } = req.params;

  // Rule 2: Validate claim ID format
  if (!isValidObjectId(id)) {
    return res.status(404).render('404', {
      message: 'Invalid claim identifier format.'
    });
  }

  try {
    // Rule 2: Load claim with its foundItem populated for relationship and ownership verification
    const claim = await Claim.findById(id).populate('foundItem');
    if (!claim) {
      return res.status(404).render('404', {
        message: 'No claim record discovered with that identifier.'
      });
    }

    // Rule 3: Allow-list validation on target status
    const requestedStatus = (req.body.status || '').trim();
    if (requestedStatus !== 'Approved' && requestedStatus !== 'Rejected') {
      return res.status(400).render('error', {
        status: 400,
        title: '400 — Invalid Decision Parameter',
        message: 'Claim decision must be strictly "Approved" or "Rejected".'
      });
    }

    // Rule 4 (Ownership check): Ensure current student is the original finder
    // Compare ObjectIds as strings to avoid reference inequality
    if (
      !claim.foundItem ||
      claim.foundItem.reportedBy.toString() !== req.currentStudent._id.toString()
    ) {
      return res.status(403).render('error', {
        status: 403,
        title: '403 — Unauthorized Decision Attempt',
        message: 'Forbidden: Only the student who reported this found item may decide claims.'
      });
    }

    // Rule 5 (State check): A claim that is not Pending cannot be decided again
    if (claim.status !== 'Pending') {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Decision Conflict',
        message: 'This claim has already been reviewed and cannot be decided again.'
      });
    }

    const reviewedAt = new Date();

    // Rule 7: APPROVE PATH
    if (requestedStatus === 'Approved') {
      // Step A: Atomically transition the claim from 'Pending' to 'Approved'
      const updatedClaim = await Claim.findOneAndUpdate(
        { _id: claim._id, status: 'Pending' },
        { $set: { status: 'Approved', reviewedAt } },
        { new: true }
      );

      if (!updatedClaim) {
        return res.status(409).render('error', {
          status: 409,
          title: '409 — Claim State Conflict',
          message: 'The claim is no longer pending and could not be approved.'
        });
      }

      // Step B: Atomically transition the found item from 'Available' to 'Returned'
      const updatedItem = await FoundItem.findOneAndUpdate(
        { _id: claim.foundItem._id, status: 'Available' },
        { $set: { status: 'Returned' } },
        { new: true }
      );

      if (!updatedItem) {
        // Rollback compensating action: Revert the claim back to Pending
        await Claim.updateOne(
          { _id: claim._id },
          { $set: { status: 'Pending', reviewedAt: null } }
        );

        return res.status(409).render('error', {
          status: 409,
          title: '409 — Item Already Returned',
          message: 'This item has already been marked as Returned. The claim approval was rolled back.'
        });
      }

      // Step C: Automatically reject any remaining Pending claims on this now-returned item
      await Claim.updateMany(
        {
          foundItem: claim.foundItem._id,
          status: 'Pending',
          _id: { $ne: claim._id }
        },
        {
          $set: {
            status: 'Rejected',
            reviewedAt
          }
        }
      );

      req.flash('success', 'Claim approved. The item is now marked as Returned.');
      return res.redirect(`/found-items/${claim.foundItem._id}`);
    }

    // Rule 8: REJECT PATH
    if (requestedStatus === 'Rejected') {
      const updatedClaim = await Claim.findOneAndUpdate(
        { _id: claim._id, status: 'Pending' },
        { $set: { status: 'Rejected', reviewedAt } },
        { new: true }
      );

      if (!updatedClaim) {
        return res.status(409).render('error', {
          status: 409,
          title: '409 — Claim State Conflict',
          message: 'The claim is no longer pending and could not be rejected.'
        });
      }

      req.flash('notice', 'Claim has been marked Rejected.');
      return res.redirect(`/found-items/${claim.foundItem._id}`);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
