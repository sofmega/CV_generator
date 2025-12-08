// backend/src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cv-generator-one-omega.vercel.app",
];

// CORS
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(
  "/payments/webhook",
  express.raw({ type: "application/json" })
);

// Normal JSON parser for all other routes
app.use(express.json({ limit: "5mb" }));

// Health Check
app.get("/", (req, res) => {
  res.send("CVPRO backend is running 🚀");
});

// Auto-mounted routes
app.use("/", routes);

export default app;
