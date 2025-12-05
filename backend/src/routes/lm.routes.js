// backend/src/routes/lm.routes.js
import { Router } from "express";
import { generateLMPdfController } from "../controllers/lm.controller.js";

const router = Router();

router.post("/pdf", generateLMPdfController);

export default router;
