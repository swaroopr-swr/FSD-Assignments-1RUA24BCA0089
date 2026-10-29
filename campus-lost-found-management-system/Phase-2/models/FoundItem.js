const mongoose = require('mongoose');
const CATEGORIES = require('../utils/categories');

/**
 * FoundItem Schema
 * Represents an item discovered and handed in or held on campus.
 * 
 * Relationship:
 * `reportedBy` stores the ObjectId referencing the Student document (_id)
 * who found and reported the item.
 */
const foundItemSchema = new mongoose.Schema(
  {
    // Descriptive title of the found item
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

    // Description of the item's appearance, brand, or condition
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Specific campus area where the item was found
    foundLocation: {
      type: String,
      required: [true, 'Found location is required'],
      trim: true,
      minlength: [2, 'Location must be at least 2 characters'],
      maxlength: [100, 'Location cannot exceed 100 characters']
    },

    // Date when the item was found (cannot be in the future)
    dateFound: {
      type: Date,
      required: [true, 'Date found is required'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Date found cannot be in the future'
      }
    },

    // Current availability status of the found item
    // In Phase 1, defaults to 'Available'
    status: {
      type: String,
      enum: ['Available', 'Returned'],
      default: 'Available'
    },

    // Reference to the Student who found and reported this item
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

module.exports = mongoose.model('FoundItem', foundItemSchema);
