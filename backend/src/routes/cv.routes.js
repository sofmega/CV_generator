// backend/src/routes/cv.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  generateCVTextController,
  generateCVPdfController,
} from "../controllers/cv.controller.js";

const router = Router();

// 🔒 Protect routes
router.post("/text", authMiddleware, generateCVTextController);
router.post("/pdf", authMiddleware, generateCVPdfController);

export default router;
