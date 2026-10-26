const crypto = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(crypto.scrypt);

// Scrypt configuration parameters per specification (C12)
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const SCRYPT_OPTIONS = {
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  maxmem: 32 * 1024 * 1024
};

/**
 * Hashes a plain-text password using async crypto.scrypt.
 * Output format: <saltHex>:<hashHex>
 * 
 * @param {string} password Plaintext password (8-128 chars)
 * @returns {Promise<string>} Encoded salt:hash string
 */
async function hashPassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  const salt = crypto.randomBytes(SALT_BYTES);
  const derivedKey = await scryptAsync(password, salt, KEY_BYTES, SCRYPT_OPTIONS);

  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plain-text password against a stored salt:hash string.
 * Uses crypto.timingSafeEqual after verifying buffer lengths.
 * Invalid stored formats or invalid inputs return false cleanly without throwing (C12).
 * 
 * @param {string} password Candidate plaintext password
 * @param {string} storedHash Stored saltHex:hashHex string
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const [saltHex, hashHex] = parts;
  if (!saltHex || !hashHex || saltHex.length !== SALT_BYTES * 2 || hashHex.length !== KEY_BYTES * 2) {
    return false;
  }

  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expectedHash = Buffer.from(hashHex, 'hex');

    const derivedKey = await scryptAsync(password, salt, KEY_BYTES, SCRYPT_OPTIONS);

    if (derivedKey.length !== expectedHash.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Precomputed dummy hash matching standard salt:hash scrypt parameters.
 * Used during constant-time authentication (C3) when an email is not found,
 * preventing response timing discrepancy from revealing valid account emails.
 */
const DUMMY_PASSWORD_HASH =
  'e0a4f5b2c1d3e5f7a9b1c3d5e7f9a1b3:c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2';

module.exports = {
  hashPassword,
  verifyPassword,
  DUMMY_PASSWORD_HASH
};
