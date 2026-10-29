const mongoose = require('mongoose');

/**
 * RosterEntry Schema
 * Simulates university registrar records for identity verification.
 * 
 * Enforces:
 * - Unique uppercase USN (e.g., 1RUA24BCA0001)
 * - Unique lowercase institutional email ending in @rvu.edu.in
 * - Department and Full Name verified from campus records
 * - Atomic registration flag (isRegistered: false -> true) preventing account duplication
 * - Reference to created Student record
 */
const rosterEntrySchema = new mongoose.Schema(
  {
    usn: {
      type: String,
      required: [true, 'USN is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{8,20}$/, 'USN must be 8-20 alphanumeric characters']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Institutional email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@rvu\.edu\.in$/, 'Institutional email must end with @rvu.edu.in']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    isRegistered: {
      type: Boolean,
      default: false
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RosterEntry', rosterEntrySchema);
