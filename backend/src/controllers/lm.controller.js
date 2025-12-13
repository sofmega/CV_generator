// backend/src/controllers/lm.controller.js
import { generateLMPdf } from "../services/lm/lmPdf.service.js";
import { saveApplication } from "../services/application.service.js";
import { logger } from "../config/logger.js";

export const generateLMPdfController = async (req, res, next) => {
  try {
    const { jobDescription, cvText } = req.body;

    if (!jobDescription) {
      const error = new Error("jobDescription is required");
      error.status = 400;
      throw error;
    }

    const pdfBuffer = await generateLMPdf(jobDescription, cvText);

    await saveApplication({
      userId: req.user.id,
      jobDescription,
      cvText,
      type: "coverLetter",
      generatedText: "PDF generated",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Cover_Letter.pdf"');

    return res.send(pdfBuffer);
  } catch (err) {
    logger.error({ err }, "LM PDF generation error");
    next(err);
  }
};
