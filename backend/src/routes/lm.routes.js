// backend/src/routes/lm.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateLMPdfController } from "../controllers/lm.controller.js";
import { usageLimiter } from "../middleware/usageLimiter.js";
import { aiGenerationLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/pdf", authMiddleware, usageLimiter, aiGenerationLimiter, generateLMPdfController);

export default router;
