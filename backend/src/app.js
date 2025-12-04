// backend/src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "5mb" }));

// Auto-mounted routes
app.use("/", routes);

export default app;
