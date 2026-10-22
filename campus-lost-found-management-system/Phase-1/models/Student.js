const mongoose = require('mongoose');

/**
 * Student Schema
 * Represents a registered student in the campus directory.
 * Other collections (LostItem, FoundItem) reference this document by its _id.
 */
const studentSchema = new mongoose.Schema(
  {
    // Full name of the student (2-80 characters)
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [80, 'Full name cannot exceed 80 characters']
    },

    // College email address: unique identifier for sign-in and notifications
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },

    // Academic department (e.g., Computer Applications, Mechanical Engineering)
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },

    // Indian mobile contact number: 10 digits starting with 6-9
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Contact number must be 10 digits starting with 6, 7, 8, or 9']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);
