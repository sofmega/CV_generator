// backend/src/routes/lm.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateLMPdfController } from "../controllers/lm.controller.js";

const router = Router();

router.post("/pdf", authMiddleware, generateLMPdfController);

export default router;
