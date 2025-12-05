// backend/src/services/openai/jsonCvParser.js
import client from "./openaiClient.js";
import { createStructuredCVPrompt } from "./cvTemplatePrompt.js";

export async function parseCvToJson(jobDescription, cvText) {
  const prompt = createStructuredCVPrompt(jobDescription, cvText);

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  let raw = response.output[0].content[0].text || "";

  // Clean possible code fences (just in case)
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Try to recover JSON between first { and last }
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const sliced = raw.slice(first, last + 1);
      try {
        return JSON.parse(sliced);
      } catch (e) {
        console.error("Failed to parse sliced CV JSON:", e);
      }
    }

    console.error("Failed to parse CV JSON, returning fallback structure:", err);

    // Minimal safe fallback so the PDF template still works
    return {
      personalInfo: {},
      summary: cvText || "",
      skills: { technical: [], soft: [], languages: [] },
      experience: [],
      education: [],
      projects: [],
      extra: { certifications: [], interests: [] },
    };
  }
}
