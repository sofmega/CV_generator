// backend/src/controllers/extract.controller.js
import {
  uploadCVToSupabase,
  extractCVTextFromStorage,
} from "../services/extract/cvExtract.service.js";

export const extractCVController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;

    // 1️⃣ Upload file to Supabase Storage
    const filePath = await uploadCVToSupabase(file);

    // 2️⃣ Extract text from stored file (NOT from memory)
    const text = await extractCVTextFromStorage(filePath);

    return res.json({ text });
  } catch (err) {
    console.error("Extract error:", err);
    res.status(500).json({ error: err.message });
  }
};
