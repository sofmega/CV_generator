// backend/src/services/lm/lmPrompt.service.js

export function createLMPrompt(jobDescription, cvText) {
  const today = new Date().toLocaleDateString("fr-FR");
  const safeCv = cvText || "(aucun CV fourni)";

  return `
You are an HR expert. Write a professional French cover letter.

 STRICT RULES — FOLLOW ALL:
1. NEVER output placeholders like [Adresse], [Nom], [Company Address], etc.
2. If the job offer does NOT provide:
   - company address → REMOVE the address line completely.
   - company department → REMOVE the line.
   - hiring manager name → Speak in general.
3. Do NOT invent missing contact details.
4. Use clean paragraphs with blank lines.
5. No markdown (no *, **, ###).
6. NO meta-comments.
7. Do NOT invent skills not present in the candidate CV.
8. Language must match job offer .

FORMAT REQUIRED (only include lines with available information):
- Full name (always include)
- City (always include)
- Email (always include)
- Phone (always include)
- Date (always include)
- Company name (ONLY if job offer contains a clear company name)
- Greeting
- Body paragraphs (3–5 paragraphs)
- Signature: cv owner name (always include)

Candidate:
Resume owner name
Resume owner city
Resume owner email
Resume owner phone

Date: ${today}

Job Offer:
${jobDescription}

Candidate CV:
${safeCv}

⚠️ IMPORTANT:
- If the job offer does NOT contain company address → DO NOT invent one → simply omit the address line.
- If the job offer does NOT explicitly contain a company name → remove the line and keep only hiring manager name( speak in general).
- The final output must NOT contain any remaining brackets or empty placeholders.

Now generate the FINAL cover letter with NO placeholders.
`;
}
