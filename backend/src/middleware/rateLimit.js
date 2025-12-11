// backend/src/middleware/rateLimit.js
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { logger } from "../config/logger.js";

// Helper to create a limiter that prefers user.id over IP
export function createUserRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req, res) => {
      // Prefer authenticated user
      if (req.user?.id) return req.user.id;

      // Safe fallback for IPv4/IPv6
      return ipKeyGenerator(req, res);
    },

    handler: (req, res) => {
      // Log rate limit event (recommended)
      logger.warn(
        {
          userId: req.user?.id || null,
          ip: req.ip,
          route: req.originalUrl,
        },
        "Rate limit exceeded"
      );

      return res.status(429).json({
        error: "Too many requests. Please slow down.",
      });
    },
  });
}

// AI generation rate limiter
export const aiGenerationLimiter = createUserRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 requests per user
});

// File upload rate limiter
export const uploadLimiter = createUserRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,                  // 5 uploads per user
});
