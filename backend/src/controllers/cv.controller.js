// backend/src/controllers/cv.controller.js
import { generateCVText } from "../services/cv/cvText.service.js";
import { generateCVPdf } from "../services/cv/cvPdf.service.js";
import { saveApplication } from "../services/application.service.js";

// Generate CV (TEXT)
export const generateCVTextController = async (req, res, next) => {
  try {
    const { jobDescription, cvText } = req.body;

    const result = await generateCVText(jobDescription, cvText);

    await saveApplication({
      jobDescription,
      cvText,
      type: "cv-text",
      generatedText: result,
    });

    return res.json({ result });
  } catch (err) {
    next(err);
  }
};

// Generate CV (PDF)
export const generateCVPdfController = async (req, res, next) => {
  try {
    const { jobDescription, cvText } = req.body;

    const pdfBuffer = await generateCVPdf(jobDescription, cvText);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="CV.pdf"');

    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
