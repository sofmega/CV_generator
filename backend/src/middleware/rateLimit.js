// backend/src/middleware/rateLimit.js
import rateLimit from "express-rate-limit";

// Helper to create a limiter that prefers user.id over IP
export function createUserRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // adds RateLimit-* headers
    legacyHeaders: false,  // disables X-RateLimit-* headers

    keyGenerator: (req) => {
      // If the user is authenticated, use their Supabase user.id
      if (req.user && req.user.id) {
        return req.user.id;
      }

      // Fallback to IP for unauthenticated routes (if you ever use it there)
      return req.ip;
    },

    handler: (req, res /*, next */) => {
      // Called when limit is exceeded
      return res.status(429).json({
        error: "Too many requests. Please slow down.",
      });
    },
  });
}

// Specific limiter for AI generations (CV, LM, etc.)
export const aiGenerationLimiter = createUserRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 requests per minute per user
});

// Specific limiter for file uploads
export const uploadLimiter = createUserRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,                  // 5 uploads per 5 minutes per user
});
