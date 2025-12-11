// backend/src/routes/extract-cv.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadCV } from "../middleware/uploadCV.js";
import { extractCVController } from "../controllers/extract.controller.js";
import { uploadLimiter } from "../middleware/rateLimit.js";

const router = Router();

// 🔒 Protect + upload file
router.post("/", authMiddleware, uploadLimiter, uploadCV, extractCVController);

export default router;
