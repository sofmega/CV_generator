// backend/src/routes/extract-cv.routes.js
import { Router } from "express";
import { uploadCV } from "../middleware/uploadCV.js";
import { extractCVController } from "../controllers/extract.controller.js";

const router = Router();

router.post("/", uploadCV, extractCVController);

export default router;
