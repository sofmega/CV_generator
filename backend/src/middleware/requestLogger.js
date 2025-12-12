// backend/src/middleware/requestLogger.js
import pinoHttp from "pino-http";
import { logger } from "../config/logger.js";

let requestLogger;

// Disable pino-http entirely when running tests
if (process.env.NODE_ENV === "test") {
  requestLogger = (req, res, next) => next();
} else {
  requestLogger = pinoHttp({
    logger,
    genReqId: (req) => req.id,
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
}

export { requestLogger };
