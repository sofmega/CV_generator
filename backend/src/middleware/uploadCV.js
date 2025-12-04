// src/middlewares/uploadCV.js
import multer from "multer";

export const uploadCV = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}).single("cv");
