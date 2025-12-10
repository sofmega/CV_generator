// backend/src/controllers/cv.controller.js
import { generateCVText } from "../services/cv/cvText.service.js";
import { generateCVPdf } from "../services/cv/cvPdf.service.js";
import { saveApplication } from "../services/application.service.js";

// -----------------------------------------------------------------------------
// Generate CV (TEXT VERSION)
// -----------------------------------------------------------------------------
export const generateCVTextController = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    //  Generate text
    const result = await generateCVText(jobDescription, cvText);

    //  Save application attempt into DB
    await saveApplication({
      jobDescription,
      cvText,
      type: "cv-text",
      generatedText: result,
    });

    return res.json({ result });
  } catch (err) {
    console.error("CV text generation failed:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------------------------
// Generate CV (PDF VERSION)
// -----------------------------------------------------------------------------
export const generateCVPdfController = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    //  Generate PDF buffer
    const pdfBuffer = await generateCVPdf(jobDescription, cvText);

    //  Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="CV.pdf"');

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("CV PDF generation failed:", err);
    return res.status(500).json({ error: err.message });
  }
};
