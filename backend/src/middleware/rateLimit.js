// backend/src/middleware/rateLimit.js
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { logger } from "../config/logger.js";

// Helper to create a limiter that prefers user.id over IP
export function createUserRateLimiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
      if (req.user?.id) return req.user.id;
      return ipKeyGenerator(req.ip); // safe IPv4/IPv6 handling
    },

    handler: (req, res) => {
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
  limit: 10,          // 10 requests per user
});

// File upload rate limiter
export const uploadLimiter = createUserRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5,               // 5 uploads per user
});
