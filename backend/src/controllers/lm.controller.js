// backend/src/controllers/lm.controller.js
import { generateLMText } from "../services/lm/lmText.service.js";
import { generateLMPdf } from "../services/lm/lmPdf.service.js";
import { saveApplication } from "../services/application.service.js";

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
      jobDescription,
      cvText,
      type: "cover-letter-pdf",
      generatedText: "PDF generated",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Cover_Letter.pdf"');

    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
