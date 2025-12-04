// backend/src/services/openai.service.js
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// ---------------------------------------------------------
// BUILD PROMPT (ONLY FIX: company name + header + spacing)
// ---------------------------------------------------------
function buildPrompt({ jobDescription, cvText, type }) {
  const today = new Date().toLocaleDateString("fr-FR");
  const safeCv = cvText || "(aucun CV fourni)";

  const header = `
Soufiane Radouane
Asnières-sur-Seine, France
soufiane.radouane99@gmail.com
07 45 76 79 13
`;

  if (type === "cover-letter-pdf" || type === "coverLetter") {
    return `
You are an HR expert. Output ONLY the final cover letter.

IMPORTANT RULES:
1. ALWAYS include this header at the top:

${header}

2. Immediately below the header, add today's date:
${today}

3. COMPANY NAME RULE:
- Extract the company name from the job offer.
- If found → mention it in the greeting AND in the introduction.
- If not found → just use “Madame, Monsieur,”.

4. SPACING RULE:
- Add one blank line between each section/paragraph.
- NEVER output text without proper line breaks.
- NEVER output markdown like *, **, etc.

5. DO NOT invent skills not in CV.
6. Use French if job offer is French.

Structure required:
- Header (provided above)
- Date
- Greeting with company name
- Short intro paragraph
- Experience paragraph
- Motivation paragraph
- Closing paragraph
- Signature: "Soufiane Radouane"

JOB OFFER:
${jobDescription}

CV:
${safeCv}

Write the final formatted letter now.
`;
  }

  // CV or text mode
  return `
You are an HR assistant. Generate ONLY the final text.

Job:
${jobDescription}

CV:
${safeCv}

Generate the best tailored ${type}, with clean spacing.
`;
}

// ---------------------------------------------------------
// SANITIZER (ONLY FIX: spacing + header cleanliness)
// ---------------------------------------------------------
function sanitizeText(text) {
  return text
    .replace(/\*\*/g, "")        // remove markdown bold
    .replace(/\*/g, "")          // remove stray *
    .replace(/\[.*?\]/g, "")     // remove any leftover placeholders
    .replace(/\n{3,}/g, "\n\n")  // max 1 blank line between paragraphs
    .trim();
}

// ---------------------------------------------------------
// MAIN FUNCTION
// ---------------------------------------------------------
export async function generateText({ jobDescription, cvText, type }) {
  try {
    const prompt = buildPrompt({ jobDescription, cvText, type });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    let text = response.output[0].content[0].text;
    text = sanitizeText(text);

    return text;
  } catch (err) {
    console.error("OpenAI generation error:", err);
    throw new Error("Failed to generate text");
  }
}
