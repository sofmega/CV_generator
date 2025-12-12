// backend/src/routes/lm.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateLMPdfController } from "../controllers/lm.controller.js";
import { usageLimiter } from "../middleware/usageLimiter.js";

const router = Router();

router.post("/pdf", authMiddleware, usageLimiter, generateLMPdfController);

export default router;
