// backend/src/middleware/requestLogger.js
import pinoHttp from "pino-http";
import { logger } from "../config/logger.js";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id, // ← attach requestId to logger context

  customLogLevel: (req, res, err) => {
    if (err) return "error";
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) => {
    return `Request completed: ${req.method} ${req.url}`;
  },

  customErrorMessage: (req, res, err) => {
    return `Request failed: ${req.method} ${req.url}`;
  },
});
