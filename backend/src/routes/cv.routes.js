// backend/src/routes/cv.routes.js
import { Router } from "express";
import {
  generateCVTextController,
  generateCVPdfController,
} from "../controllers/cv.controller.js";

const router = Router();

router.post("/text", generateCVTextController);
router.post("/pdf", generateCVPdfController);

export default router;
