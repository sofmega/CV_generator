// backend/src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Allow local dev + Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://cv-generator-one-omega.vercel.app", // production frontend
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("CVPRO backend is running 🚀");
});

// Auto-mounted routes
app.use("/", routes);

export default app;
