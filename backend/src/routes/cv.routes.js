// backend/src/routes/cv.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  generateCVTextController,
  generateCVPdfController,
} from "../controllers/cv.controller.js";
import { aiGenerationLimiter } from "../middleware/rateLimit.js";

const router = Router();

// 🔒 Protect routes
router.post("/text", authMiddleware, aiGenerationLimiter, generateCVTextController);
router.post("/pdf", authMiddleware, aiGenerationLimiter, generateCVPdfController);

export default router;
