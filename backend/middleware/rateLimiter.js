const rateLimit = require('express-rate-limit');

// 10 requests per user per hour
const urlRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Limit each user to 10 requests per windowMs
  keyGenerator: (req, res) => {
    // We expect req.user to be populated by the protect middleware
    if (req.user) {
      return req.user._id.toString();
    }
    return req.ip;
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: 'Too many URLs generated from this account. Please wait.',
      resetTime: req.rateLimit.resetTime
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, default: false } // Prevents issues with local requests missing proper IP/headers
});

module.exports = { urlRateLimiter };
