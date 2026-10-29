/**
 * Dual-Counter In-Memory Rate Limiter (C4)
 * Enforces two separate limits per protected endpoint:
 * 1. Broad IP counter: blocks distributed brute-force / credential stuffing
 * 2. Strict IP + Email counter: blocks targeted password cracking
 * 
 * Features:
 * - Independent in-memory sliding windows
 * - Periodic background sweep of expired keys (every 5 minutes)
 * - resetLimiters() hook active strictly when NODE_ENV === 'test'
 * - Does not enable 'trust proxy'
 */

// Stores tracking attempts: Map<key, { count, resetAt }>
const ipCounters = new Map();
const ipEmailCounters = new Map();

/**
 * Periodically purge expired records from tracking maps to prevent memory leaks
 */
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let sweepTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipCounters.entries()) {
    if (record.resetAt <= now) ipCounters.delete(key);
  }
  for (const [key, record] of ipEmailCounters.entries()) {
    if (record.resetAt <= now) ipEmailCounters.delete(key);
  }
}, SWEEP_INTERVAL_MS);

// Allow the process to exit naturally without waiting for this background timer
if (sweepTimer.unref) sweepTimer.unref();

/**
 * Creates a rate-limiting middleware instance with customized thresholds.
 * 
 * @param {Object} options
 * @param {string} options.endpointName Unique identifier for endpoint partition
 * @param {number} options.ipMax Max attempts allowed per IP
 * @param {number} options.ipWindowMs Time window for IP counter (ms)
 * @param {number} [options.ipEmailMax] Max attempts per IP + Email combination (optional)
 * @param {number} [options.ipEmailWindowMs] Time window for IP + Email combination (ms)
 * @param {function} [options.extractEmail] Function to extract/normalize email from req (default reads req.body.email)
 */
function createRateLimiter({
  endpointName,
  ipMax = 20,
  ipWindowMs = 15 * 60 * 1000,
  ipEmailMax = 5,
  ipEmailWindowMs = 15 * 60 * 1000,
  extractEmail = (req) => (typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '')
}) {
  return function rateLimiterMiddleware(req, res, next) {
    // Only rate-limit state-changing attempts (POST)
    if (req.method !== 'POST') {
      return next();
    }

    const now = Date.now();
    const clientIp = req.socket?.remoteAddress || '127.0.0.1';
    const ipKey = `${endpointName}:ip:${clientIp}`;

    // 1. Check & increment IP Counter
    let ipRecord = ipCounters.get(ipKey);
    if (!ipRecord || ipRecord.resetAt <= now) {
      ipRecord = { count: 1, resetAt: now + ipWindowMs };
      ipCounters.set(ipKey, ipRecord);
    } else {
      ipRecord.count += 1;
    }

    if (ipRecord.count > ipMax) {
      res.setHeader('Retry-After', Math.ceil((ipRecord.resetAt - now) / 1000));
      return res.status(429).render('error', {
        status: 429,
        title: '429 — Too Many Attempts',
        message: 'Too many attempts from your network. Please try again later.'
      });
    }

    // 2. Check & increment IP + Email Counter (if applicable)
    if (ipEmailMax > 0) {
      const email = extractEmail(req);
      if (email) {
        const ipEmailKey = `${endpointName}:ip_email:${clientIp}:${email}`;
        let ipEmailRecord = ipEmailCounters.get(ipEmailKey);
        if (!ipEmailRecord || ipEmailRecord.resetAt <= now) {
          ipEmailRecord = { count: 1, resetAt: now + ipEmailWindowMs };
          ipEmailCounters.set(ipEmailKey, ipEmailRecord);
        } else {
          ipEmailRecord.count += 1;
        }

        if (ipEmailRecord.count > ipEmailMax) {
          res.setHeader('Retry-After', Math.ceil((ipEmailRecord.resetAt - now) / 1000));
          return res.status(429).render('error', {
            status: 429,
            title: '429 — Too Many Attempts',
            message: 'Too many attempts for this credential. Please try again later.'
          });
        }
      }
    }

    next();
  };
}

/**
 * Resets all rate-limiting memory stores.
 * Strictly allowed only when NODE_ENV === 'test'.
 */
function resetLimiters() {
  if (process.env.NODE_ENV === 'test') {
    ipCounters.clear();
    ipEmailCounters.clear();
  }
}

module.exports = {
  createRateLimiter,
  resetLimiters
};
