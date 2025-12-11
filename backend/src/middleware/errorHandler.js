// backend/src/middleware/errorHandler.js

import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error(
    {
      err,
      requestId: req.id,
      route: req.originalUrl,
      method: req.method,
      userId: req.user?.id || null,
    },
    "Unhandled Error"
  );

  const status = err.status || 500;

  res.status(status).json({
    error: err.message || "Server Error",
    requestId: req.id, // helpful for debugging
  });
}
