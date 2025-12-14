// backend/src/app.js
import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

import { requestId } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cv-generator-one-omega.vercel.app",
];

// 1️⃣ assign requestId FIRST
app.use(requestId);

// 2️⃣ bind Pino logger with requestId
app.use(requestLogger);

// 3️⃣ CORS
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// 4️⃣ Stripe webhook RAW parser
app.use(
  "/webhooks/stripe",
  express.raw({ type: "application/json" })
);

// 5️⃣ Normal JSON parser
app.use(express.json({ limit: "5mb" }));

// 6️⃣ Health Check
app.get("/", (req, res) => {
  res.send("CVPRO backend is running 🚀");
});

// 7️⃣ Auto-mounted routes
app.use("/", routes);

// 8️⃣ GLOBAL ERROR HANDLER (last)
app.use(errorHandler);

export default app;
