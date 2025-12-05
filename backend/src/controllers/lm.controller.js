// backend/src/controllers/lm.controller.js

import { generateLMText } from "../services/lm/lmText.service.js";
import { generateLMPdf } from "../services/lm/lmPdf.service.js";
import { saveApplication } from "../services/application.service.js";

export const generateLMPdfController = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: "jobDescription is required" });
    }

    // Generate PDF buffer
    const pdfBuffer = await generateLMPdf(jobDescription, cvText);

    // Save to DB
    await saveApplication({
      jobDescription,
      cvText,
      type: "cover-letter-pdf",
      generatedText: "PDF generated",
    });

    // Response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Cover_Letter.pdf"');

    return res.send(pdfBuffer);

  } catch (err) {
    console.error("LM PDF generation error:", err);
    return res.status(500).json({ error: err.message });
  }
};
