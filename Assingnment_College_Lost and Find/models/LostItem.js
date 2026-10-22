const mongoose = require('mongoose');
const CATEGORIES = require('../utils/categories');

/**
 * LostItem Schema
 * Represents an item reported lost on campus.
 * 
 * Relationship:
 * `reportedBy` stores the ObjectId referencing the Student document (_id)
 * who filed the lost report, NOT a duplicated copy of the student's name or email.
 */
const lostItemSchema = new mongoose.Schema(
  {
    // Descriptive title of the lost item
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters'],
      maxlength: [80, 'Item name cannot exceed 80 characters']
    },

    // Category selected from the fixed list
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid item category'
      }
    },

    // Detailed description (colour, distinct marks, serial number, etc.)
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Specific campus area where the item was last seen
    lastSeenLocation: {
      type: String,
      required: [true, 'Last seen location is required'],
      trim: true,
      minlength: [2, 'Location must be at least 2 characters'],
      maxlength: [100, 'Location cannot exceed 100 characters']
    },

    // Date when the item was lost (cannot be in the future)
    dateLost: {
      type: Date,
      required: [true, 'Date lost is required'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Date lost cannot be in the future'
      }
    },

    // Resolution status of the report
    status: {
      type: String,
      enum: ['Lost', 'Resolved'],
      default: 'Lost'
    },

    // Reference to the Student who filed this report
    // Storing ObjectId maintains relational integrity with the students collection
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Reported by student reference is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LostItem', lostItemSchema);
