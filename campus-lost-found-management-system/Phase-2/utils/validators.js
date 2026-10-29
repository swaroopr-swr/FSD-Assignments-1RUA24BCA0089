const CATEGORIES = require('./categories');

/**
 * Validates a 24-character hexadecimal MongoDB ObjectId string.
 * We use strict regex instead of mongoose.Types.ObjectId.isValid()
 * because Mongoose's built-in check can accept 12-byte strings or numbers.
 */
function isValidObjectId(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Checks whether a value is undefined, null, or only whitespace.
 */
function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

/**
 * Basic email format validator.
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Indian mobile number format: exactly 10 digits starting with 6-9.
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  return /^[6-9]\d{9}$/.test(phone.trim());
}

/**
 * Escapes regular expression special characters to make user search input safe.
 */
function escapeRegex(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Validates Student form fields.
 * Returns an errors object mapping field names to error messages.
 */
function validateStudent(data) {
  const errors = {};

  const fullName = (data.fullName || '').trim();
  if (isBlank(fullName)) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < 2 || fullName.length > 80) {
    errors.fullName = 'Full name must be between 2 and 80 characters.';
  }

  const email = (data.email || '').trim().toLowerCase();
  if (isBlank(email)) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const department = (data.department || '').trim();
  if (isBlank(department)) {
    errors.department = 'Department is required.';
  }

  const contactNumber = (data.contactNumber || '').trim();
  if (isBlank(contactNumber)) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!isValidPhone(contactNumber)) {
    errors.contactNumber = 'Contact number must be exactly 10 digits starting with 6, 7, 8, or 9.';
  }

  return errors;
}

/**
 * Validates Item report form fields (used for both Lost and Found items).
 * isLost: boolean (true for LostItem, false for FoundItem)
 */
function validateItem(data, isLost = true) {
  const errors = {};

  const itemName = (data.itemName || '').trim();
  if (isBlank(itemName)) {
    errors.itemName = 'Item name is required.';
  } else if (itemName.length < 2 || itemName.length > 80) {
    errors.itemName = 'Item name must be between 2 and 80 characters.';
  }

  const category = (data.category || '').trim();
  if (isBlank(category)) {
    errors.category = 'Please select a category.';
  } else if (!CATEGORIES.includes(category)) {
    errors.category = 'Selected category is not recognized.';
  }

  const description = (data.description || '').trim();
  if (isBlank(description)) {
    errors.description = 'Description is required.';
  } else if (description.length < 10 || description.length > 500) {
    errors.description = 'Description must be between 10 and 500 characters.';
  }

  const locationField = isLost ? 'lastSeenLocation' : 'foundLocation';
  const locationLabel = isLost ? 'Last seen location' : 'Found location';
  const location = (data[locationField] || '').trim();
  if (isBlank(location)) {
    errors[locationField] = `${locationLabel} is required.`;
  } else if (location.length < 2 || location.length > 100) {
    errors[locationField] = `${locationLabel} must be between 2 and 100 characters.`;
  }

  const dateField = isLost ? 'dateLost' : 'dateFound';
  const dateLabel = isLost ? 'Date lost' : 'Date found';
  const dateVal = data[dateField];
  if (isBlank(dateVal)) {
    errors[dateField] = `${dateLabel} is required.`;
  } else {
    const parsedDate = new Date(dateVal);
    if (isNaN(parsedDate.getTime())) {
      errors[dateField] = `Please enter a valid ${dateLabel.toLowerCase()}.`;
    } else {
      // Must not be in the future (allow current date up to end of today)
      const now = new Date();
      if (parsedDate > now) {
        errors[dateField] = `${dateLabel} cannot be in the future.`;
      }
    }
  }

  return errors;
}

/**
 * Validates Claim form fields.
 * Enforces non-blank reason between 10 and 500 characters.
 */
function validateClaim(data) {
  const errors = {};
  const reason = (data && data.reason ? data.reason : '').trim();

  if (isBlank(reason)) {
    errors.reason = 'Please provide a reason and description of ownership proof.';
  } else if (reason.length < 10 || reason.length > 500) {
    errors.reason = 'Proof of ownership reason must be between 10 and 500 characters.';
  }

  return errors;
}

module.exports = {
  isValidObjectId,
  isBlank,
  isValidEmail,
  isValidPhone,
  escapeRegex,
  validateStudent,
  validateItem,
  validateClaim
};

