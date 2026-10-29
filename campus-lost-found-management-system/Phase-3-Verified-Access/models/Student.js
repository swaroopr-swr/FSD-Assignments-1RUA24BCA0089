const mongoose = require('mongoose');

/**
 * Student Schema
 * Represents an authenticated, verified student in the campus directory.
 * 
 * Enforces:
 * - USN: Unique uppercase identifier linked to university registrar records
 * - Email: Institutional @rvu.edu.in address
 * - passwordHash: Async scrypt hash, select: false (C7) to prevent accidental template exposure
 * - isVerified & verifiedAt: Verified status flags confirmed during two-step registration
 * - rosterEntry: Reference to source RosterEntry
 */
const studentSchema = new mongoose.Schema(
  {
    // Full name of the student (verified from registrar roster)
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [80, 'Full name cannot exceed 80 characters']
    },

    // University Seat Number (USN), unique uppercase
    usn: {
      type: String,
      required: [true, 'USN is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{8,20}$/, 'USN must be 8-20 alphanumeric characters']
    },

    // Institutional email address ending in @rvu.edu.in
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@rvu\.edu\.in$/, 'Must be a valid @rvu.edu.in college email address']
    },

    // Async scrypt password hash. select: false prevents accidental leakage in queries or templates (C7)
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },

    // Academic department (verified from registrar roster)
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },

    // Contact number: 10 digits starting with 6-9
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Contact number must be 10 digits starting with 6, 7, 8, or 9']
    },

    // Verification state
    isVerified: {
      type: Boolean,
      default: false
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    // Link to originating registrar entry
    rosterEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RosterEntry',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);
