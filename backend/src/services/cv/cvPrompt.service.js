// backend/src/services/cv/cvPrompt.service.js
export function createCVPrompt(jobDescription, cvText) {
  const safeCv = cvText || "(aucun CV fourni)";
  const today = new Date().toLocaleDateString("fr-FR");

  return `
You are an expert HR CV writer.
Generate a clean, professional CV in French.

RULES:
- NO markdown (no *, **, ###)
- NO code blocks
- Use simple plain text only
- Use clean formatting with blank lines
- Remove any placeholders like [Company], [Date], etc.
- Do NOT talk to the user ("here is your CV")
- Output ONLY the CV

FORMAT:
1. Personal Info
2. Profil
3. Compétences Techniques
4. Expériences Professionnelles
5. Formation

Candidate:
Soufiane Radouane
Asnières-sur-Seine, France
soufiane.radouane99@gmail.com
07 45 76 79 13

Date: ${today}

Job Offer:
${jobDescription}

Candidate CV data:
${safeCv}

Now rewrite an improved CV following the rules above.
  `;
}


