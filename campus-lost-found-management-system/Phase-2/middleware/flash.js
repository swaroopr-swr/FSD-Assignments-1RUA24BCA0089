/**
 * Flash message middleware using signed cookies.
 * Provides a one-time message display mechanism across HTTP redirects.
 */
function flashMiddleware(req, res, next) {
  // Method to set a flash message for the subsequent response
  req.flash = function (type, message) {
    const flashData = JSON.stringify({ type, message });
    res.cookie('_flash', flashData, {
      signed: true,
      httpOnly: true,
      maxAge: 60 * 1000 // 1 minute expiry
    });
  };

  // Consume any existing flash cookie
  const cookieVal = req.signedCookies._flash;
  if (cookieVal) {
    try {
      res.locals.flash = JSON.parse(cookieVal);
    } catch (err) {
      res.locals.flash = null;
    }
    // Clear the cookie immediately so it displays only once
    res.clearCookie('_flash');
  } else {
    res.locals.flash = null;
  }

  next();
}

module.exports = flashMiddleware;
