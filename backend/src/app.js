// backend/src/app.js
import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import { config } from "./config/env.js";
import { requestId } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/**
 * --------------------------------------------------
 *  Request ID FIRST (important for logging)
 * --------------------------------------------------
 */
app.use(requestId);

/**
 * --------------------------------------------------
 *  Logger
 * --------------------------------------------------
 */
app.use(requestLogger);

/**
 * --------------------------------------------------
 *  CORS — SINGLE SOURCE OF TRUTH
 * --------------------------------------------------
 */
const corsMiddleware = cors({
  origin: (origin, callback) => {
    //  Allow server-to-server (Stripe, cron, etc.)
    if (!origin) {
      return callback(null, true);
    }

    //  Allow only the frontend origin
    if (origin === config.frontend.origin) {
      return callback(null, true);
    }

    //  dev-only logging
    if (process.env.NODE_ENV !== "production") {
      console.warn("Blocked CORS origin:", origin);
    }

    //  Block everything else
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
  exposedHeaders: ["x-request-id"],
});

// Required for browser preflight requests
app.options("*", corsMiddleware);
app.use(corsMiddleware);

/**
 * --------------------------------------------------
 *  Stripe webhook — RAW body (MUST be before json)
 * --------------------------------------------------
 */
app.use(
  "/webhooks/stripe",
  express.raw({ type: "application/json" })
);

/**
 * --------------------------------------------------
 *  JSON parser
 * --------------------------------------------------
 */
app.use(express.json({ limit: "5mb" }));

/**
 * --------------------------------------------------
 *  Health check
 * --------------------------------------------------
 */
app.get("/", (req, res) => {
  res.send("CVPRO backend is running 🚀");
});

/**
 * --------------------------------------------------
 *  Routes
 * --------------------------------------------------
 */
app.use("/", routes);

/**
 * --------------------------------------------------
 *  Error handler (LAST)
 * --------------------------------------------------
 */
app.use(errorHandler);

export default app;
