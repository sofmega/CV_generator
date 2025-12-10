// backend/src/middleware/uploadCV.js
import multer from "multer";

// MIME types
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const storage = multer.memoryStorage();

export const uploadCV = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Invalid file type. Please upload PDF, DOCX, or TXT."), false);
    }
    cb(null, true);
  },
}).single("cv");
