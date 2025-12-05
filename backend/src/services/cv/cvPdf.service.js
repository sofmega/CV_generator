// backend/src/services/cv/cvPdf.service.js
import { parseCvToJson } from "../openai/jsonCvParser.js";
import { generateCVPdfFromData } from "../../utils/pdf/cvTemplateV1.js";

export async function generateCVPdf(jobDescription, cvText) {
  // 1. Build a structured CV JSON, tailored to the job offer
  const cvData = await parseCvToJson(jobDescription, cvText);

  // 2. Render that structure with the professional PDF template
  const pdfBuffer = await generateCVPdfFromData(cvData);

  return pdfBuffer;
}
