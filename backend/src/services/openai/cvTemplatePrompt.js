// backend/src/services/openai/cvTemplatePrompt.js
export function createStructuredCVPrompt(jobDescription, cvText) {
  const safeCv = cvText || "(aucun CV fourni)";

  return `
You are an expert French CV writer and information extractor.

TASK
- Read the candidate CV and the job offer.
- Build a TAILORED CV structure in JSON.
- Reuse ONLY real information from the candidate CV.
- You may rephrase and reorganize content to match the job offer, but do NOT invent:
  - new technologies
  - new employers
  - new degrees
  - fake dates.

OUTPUT
- Output VALID JSON only.
- NO markdown, NO backticks, NO comments.
- Use EXACTLY this schema and keys:

{
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

NOTES
- Use null or "" when information is missing.
- For languages, re-use the info from the CV like "Français (courant)", "Anglais (B2)".
- For dates, keep short formats like "mai 2025", "aujourd'hui".
- Order experiences and skills to match the job offer as much as possible.

JOB OFFER
${jobDescription}

CANDIDATE CV
${safeCv}
`;
}
