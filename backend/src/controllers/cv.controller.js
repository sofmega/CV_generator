// backend/src/controllers/cv.controller.js
import { extractCVText, uploadCVToSupabase } from "../services/cvExtract.service.js";

export const extractCVController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;

    // Upload to Supabase Storage
    await uploadCVToSupabase(file);

    // Extract text
    const text = await extractCVText(file);

    return res.json({ text });
  } catch (err) {
    console.error("CV extract error:", err);
    return res.status(500).json({ error: err.message });
  }
};
