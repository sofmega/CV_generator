import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createFeedbackController } from "../controllers/feedback.controller.js";

const router = Router();

// POST /feedback
router.post("/", authMiddleware, createFeedbackController);

export default router;
