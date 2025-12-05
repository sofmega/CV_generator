// backend/src/services/cv/cvPdf.service.js
import { generateCVText } from "./cvText.service.js";
import { generatePDF } from "../../utils/pdfGenerator.js";

export async function generateCVPdf(jobDescription, cvText) {
  const text = await generateCVText(jobDescription, cvText);
  return generatePDF(text);
}
