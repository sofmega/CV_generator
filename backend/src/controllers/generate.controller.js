// backend/src/controllers/generate.controller.js
import { generateText } from "../services/openai.service.js";
import { saveApplication } from "../services/application.service.js";
import { generatePDF } from "../utils/pdfGenerator.js";

export const generateController = async (req, res) => {
  try {
    const { jobDescription, cvText, type } = req.body;

    if (!jobDescription || !type)
      return res.status(400).json({ error: "jobDescription and type are required" });

    // Generate text using AI
    const generatedText = await generateText({ jobDescription, cvText, type });

    // Save in DB
    await saveApplication({ jobDescription, cvText, type, generatedText });

    // ---- PDF FLOW ----
    if (type === "cover-letter-pdf") {
      const pdfBuffer = await generatePDF(generatedText);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Cover_Letter.pdf"`
      );

      return res.send(pdfBuffer);
    }

    // ---- DEFAULT JSON (CV text) ----
    return res.json({ result: generatedText });

  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: err.message });
  }
};
