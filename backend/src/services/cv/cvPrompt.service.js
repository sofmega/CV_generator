// backend/src/services/cv/cvPrompt.service.js
export function createCVPrompt(jobDescription, cvText) {
  const safeCv = cvText || "(no CV provided)";
  const today = new Date().toLocaleDateString("fr-FR");

  return `
You are an expert HR CV writer and ATS optimization specialist.

=====================
CRITICAL LANGUAGE RULE
=====================
- Detect the language of the JOB OFFER.
- If the job offer language is clear → write all generated text fields in that language.
- If job offer language is unclear → use the CV language.
- NEVER mix languages.

=====================
STRICT RULES — MUST FOLLOW ALL
=====================
1. OUTPUT MUST BE VALID JSON ONLY. No extra text before or after.
2. No markdown, no code blocks, no comments.
3. DO NOT invent information (companies, dates, degrees, tools, metrics, links).
4. Use ONLY information explicitly present in the candidate CV text.
5. Job offer is used ONLY to:
   - prioritize relevant existing skills/experience
   - choose the most relevant wording
   - reorder content
   DO NOT add skills not present in the CV.
6. If a field is missing in the CV, use empty string "" or empty array [] (never placeholders).
7. Remove any placeholders like [Company], [Date], etc. Do not output brackets.
8. Keep content concise and one-page oriented:
   - Summary: 2–4 lines maximum
   - Experience bullets: 3–6 bullets per role
   - Each bullet: one line, action + impact only if present in CV
9. Dates: keep exactly as found in CV. If unclear, leave empty "".
10. Links: include only if explicitly found in CV.

=====================
LABELS REQUIREMENT (IMPORTANT)
=====================
- Fill meta.language with a short language code (examples: "en", "fr", "es", "de", "ar").
- Fill meta.labels with correct professional CV section titles in the detected language.
- Do NOT translate content from another language; write everything consistently in the detected language.

=====================
REQUIRED JSON SCHEMA (MUST MATCH EXACTLY)
=====================
{
  "meta": {
    "language": "",
    "labels": {
      "profile": "",
      "skills": "",
      "experience": "",
      "education": "",
      "projects": "",
      "other": "",
      "technicalSkills": "",
      "softSkills": "",
      "languages": "",
      "certifications": "",
      "interests": "",
      "technologiesPrefix": ""
    }
  },
  "personalInfo": {
    "fullName": "",
    "title": "",
    "location": "",
    "email": "",
    "phone": "",
    "links": {
      "linkedin": "",
      "github": "",
      "portfolio": ""
    }
  },
  "summary": "",
  "skills": {
    "technical": [],
    "soft": [],
    "languages": []
  },
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "details": []
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],
  "extra": {
    "certifications": [],
    "interests": []
  }
}

=====================
CONTEXT
=====================

Today: ${today}

Job Offer (for prioritization only):
${jobDescription}

Candidate CV text (source of truth):
${safeCv}

=====================
FINAL INSTRUCTION
=====================
Return ONLY the JSON object matching the schema exactly.
`;
}
