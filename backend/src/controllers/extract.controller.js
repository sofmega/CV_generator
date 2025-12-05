// backend/src/controllers/extract.controller.js
import { extractCVText, uploadCVToSupabase } from "../services/extract/cvExtract.service.js";

export const extractCVController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;

    // Upload to Supabase storage
    await uploadCVToSupabase(file);

    // Extract text
    const text = await extractCVText(file);

    return res.json({ text });
  } catch (err) {
    console.error("Extract error:", err);
    res.status(500).json({ error: err.message });
  }
};
