const mongoose = require('mongoose');

/**
 * Claim Schema
 * Represents a formal claim slip filed by a student asserting ownership
 * over a discovered item in campus custody.
 * 
 * References:
 * - `foundItem`: ObjectId referencing the FoundItem being claimed.
 * - `claimedBy`: ObjectId referencing the Student asserting ownership.
 * 
 * Compound Unique Index:
 * `{ foundItem: 1, claimedBy: 1 }` with `{ unique: true }`.
 * Why this index exists:
 * It enforces at the database storage engine level that a student may submit
 * at most one claim per found item, preventing spam submissions or race conditions
 * where duplicate claims could be inserted concurrently.
 */
const claimSchema = new mongoose.Schema(
  {
    // Reference to the found article being claimed
    foundItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundItem',
      required: [true, 'Found item reference is required']
    },

    // Reference to the student asserting ownership
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Claimant student reference is required']
    },

    // Description of proof (serial numbers, hidden markings, contents)
    reason: {
      type: String,
      required: [true, 'Reason and proof of ownership are required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },

    // Lifecycle status of this claim slip
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid claim status'
      },
      default: 'Pending'
    },

    // Timestamp recorded when the finder approves or rejects this claim
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: guarantees one claim per student per found item
claimSchema.index({ foundItem: 1, claimedBy: 1 }, { unique: true });

module.exports = mongoose.model('Claim', claimSchema);
