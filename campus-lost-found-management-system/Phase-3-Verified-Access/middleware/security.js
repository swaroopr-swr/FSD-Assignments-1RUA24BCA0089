/**
 * Security Baseline Middleware
 * Zero-dependency defenses:
 * 1. setSecurityHeaders: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
 * 2. verifyOrigin: Origin/Referer verification on state-changing requests (POST, PATCH, PUT, DELETE)
 * 3. sanitizeInputTypes: Rejects non-string types, arrays, operator objects, and oversized inputs (C6)
 */

function setSecurityHeaders(req, res, next) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent framing (clickjacking defense)
  res.setHeader('X-Frame-Options', 'DENY');

  // Strict same-origin referrer policy
  res.setHeader('Referrer-Policy', 'same-origin');

  // Content Security Policy: strict 'self' baseline with minimum required allowances
  // - script-src 'self': external scripts only (e.g. /js/confirm.js), no inline execution
  // - style-src 'self' 'unsafe-inline': allows theme tokens and inline styling attributes
  // - img-src 'self' data:: local images and data URIs
  // - frame-ancestors 'none': denies iframe embedding
  // - form-action 'self': form submissions restricted to current application host
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; form-action 'self'"
  );

  next();
}

/**
 * Validates Origin or Referer header on state-changing requests to mitigate CSRF attacks (C9).
 */
function verifyOrigin(req, res, next) {
  // Safe HTTP read methods are exempt from origin validation
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const host = req.get('host');
  if (!host) {
    return res.status(403).render('error', {
      status: 403,
      title: '403 — Forbidden',
      message: 'Missing Host header.'
    });
  }

  const origin = req.get('origin');
  const referer = req.get('referer');

  // Explicit 'null' origin is rejected (e.g. sandboxed iframes, file://, data: URI triggers)
  if (origin === 'null') {
    return res.status(403).render('error', {
      status: 403,
      title: '403 — Forbidden',
      message: 'Requests with null origin are refused.'
    });
  }

  if (origin) {
    try {
      const parsedOrigin = new URL(origin);
      if (parsedOrigin.host === host) {
        return next();
      }
    } catch {
      // Malformed Origin header
    }
    return res.status(403).render('error', {
      status: 403,
      title: '403 — Forbidden',
      message: 'Cross-origin state-changing request blocked.'
    });
  }

  if (referer) {
    try {
      const parsedReferer = new URL(referer);
      if (parsedReferer.host === host) {
        return next();
      }
    } catch {
      // Malformed Referer header
    }
    return res.status(403).render('error', {
      status: 403,
      title: '403 — Forbidden',
      message: 'Cross-origin state-changing request blocked.'
    });
  }

  // Neither Origin nor Referer provided on a state-changing request
  return res.status(403).render('error', {
    status: 403,
    title: '403 — Forbidden',
    message: 'Origin verification failed. Missing Origin or Referer header.'
  });
}

/**
 * Strict Input Type and Size Guard (C6)
 * Rejects non-string types (arrays, nested objects such as email[$ne]=x) and fields > 2000 chars.
 * Does not reassign req.query (compatible with Express 5).
 */
function sanitizeInputTypes(req, res, next) {
  // Inspect query parameters
  if (req.query && typeof req.query === 'object') {
    for (const [key, val] of Object.entries(req.query)) {
      if (typeof val !== 'string') {
        return res.status(400).render('error', {
          status: 400,
          title: '400 — Bad Request',
          message: `Query parameter "${key}" must be a plain string.`
        });
      }
      if (val.length > 2000) {
        return res.status(400).render('error', {
          status: 400,
          title: '400 — Bad Request',
          message: `Query parameter "${key}" exceeds the 2000-character limit.`
        });
      }
    }
  }

  // Inspect request body
  if (req.body && typeof req.body === 'object') {
    for (const [key, val] of Object.entries(req.body)) {
      if (typeof val !== 'string') {
        return res.status(400).render('error', {
          status: 400,
          title: '400 — Bad Request',
          message: `Request field "${key}" must be a plain string.`
        });
      }
      if (val.length > 2000) {
        return res.status(400).render('error', {
          status: 400,
          title: '400 — Bad Request',
          message: `Request field "${key}" exceeds the 2000-character limit.`
        });
      }
    }
  }

  next();
}

module.exports = {
  setSecurityHeaders,
  verifyOrigin,
  sanitizeInputTypes
};
