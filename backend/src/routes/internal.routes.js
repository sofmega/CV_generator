// backend/src/routes/internal.routes.js
import { Router } from "express";
import { cleanupOldCvs } from "../services/storage/cleanupCvFiles.service.js";

const router = Router();

// Simple token protection (enough for cron jobs)
router.post("/cleanup-cvs", async (req, res) => {
  const token = req.headers["x-cron-token"];

  if (token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await cleanupOldCvs();
  res.json({ ok: true });
});

export default router;
