// backend/src/controllers/extract.controller.js
import {
  uploadCVToSupabase,
  extractCVTextFromStorage,
} from "../services/extract/cvExtract.service.js";

export const extractCVController = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.status = 400;
      throw error;
    }

    const filePath = await uploadCVToSupabase(req.file);
    const text = await extractCVTextFromStorage(filePath);

    return res.json({ text });
  } catch (err) {
    next(err);
  }
};
