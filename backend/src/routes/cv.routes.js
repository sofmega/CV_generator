// backend/src/routes/cv.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  generateCVTextController,
  generateCVPdfController,
} from "../controllers/cv.controller.js";
import { aiGenerationLimiter } from "../middleware/rateLimit.js";
import { usageLimiter } from "../middleware/usageLimiter.js";

const router = Router();

// 🔒 Protect routes
router.post("/text", authMiddleware, aiGenerationLimiter, usageLimiter, generateCVTextController);
router.post("/pdf", authMiddleware, aiGenerationLimiter, usageLimiter, generateCVPdfController);

export default router;
