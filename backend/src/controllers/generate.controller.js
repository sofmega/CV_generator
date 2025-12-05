// backend/src/controllers/generate.controller.js
import { generateText } from "../services/openai.service.js";
import { saveApplication } from "../services/application.service.js";
import { generatePDF } from "../utils/pdfGenerator.js";

export const generateController = async (req, res) => {
  try {
    const { jobDescription, cvText, type } = req.body;

    if (!jobDescription || !type) {
      return res.status(400).json({ error: "jobDescription and type are required" });
    }

    // 1. Generate text (CV or LM)
    const generatedText = await generateText({ jobDescription, cvText, type });

    // 2. Save to DB (optional)
    await saveApplication({
      jobDescription,
      cvText,
      type,
      generatedText,
    });

    // 3. If PDF is requested → return PDF
    if (type === "cover-letter-pdf" || type === "cv-pdf") {
      const pdfBuffer = await generatePDF(generatedText);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${type === "cv-pdf" ? "CV.pdf" : "Cover_Letter.pdf"}"`
      );

      return res.send(pdfBuffer);
    }

    // 4. Default: return text
    return res.json({ result: generatedText });
  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: err.message });
  }
};
