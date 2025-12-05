// backend/src/services/lm/lmPdf.service.js
import { generateLMText } from "./lmText.service.js";
import { generatePDF } from "../../utils/pdfGenerator.js";

export async function generateLMPdf(jobDescription, cvText) {
  const text = await generateLMText(jobDescription, cvText);
  return generatePDF(text);
}
