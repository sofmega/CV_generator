// backend/src/routes/internal.routes.js
import { Router } from "express";
import { cleanupOldCvs } from "../services/storage/cleanupCvFiles.service.js";
import { env } from "../config/env.js";

const router = Router();

router.post("/cleanup-cvs", async (req, res) => {
  const token = req.headers["x-cron-token"];

  //  require header + validated secret
  if (!token || token !== env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await cleanupOldCvs();
  res.json({ ok: true });
});

export default router;
