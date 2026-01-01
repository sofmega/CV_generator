export function createLMPrompt(jobDescription, cvText) {
  const today = new Date().toLocaleDateString("fr-FR");
  const safeCv = cvText || "(no CV provided)";

  return `
You are an expert HR professional.
You must write a PROFESSIONAL cover letter adapted to the language, culture,
and recruitment standards of the job offer.

=====================
CRITICAL LANGUAGE RULE
=====================

- Detect the language of the JOB OFFER.
- If the job offer language is clear → write the cover letter in that language.
- If the job offer language is unclear → detect the CV language and use it.
- NEVER mix languages.
- Use HR standards, tone, and conventions of that language and job market.

=====================
STRICT RULES — MUST FOLLOW ALL
=====================

1. DO NOT invent any information.
2. DO NOT output placeholders such as [Name], [Address], [Company], etc.
3. Use ONLY information explicitly present in:
   - the job offer
   - the candidate CV
4. If a piece of information is missing, OMIT the line completely.
5. Do NOT repeat the CV word-for-word.
6. Do NOT invent skills, tools, or experiences.
7. NO markdown, NO bullet points, NO emojis.
8. Use clean paragraphs separated by ONE blank line.
9. Maximum length: one page.
10. NO subject line inside the letter.
11. Tone must be professional, natural, and aligned with the target language’s HR standards.

=====================
MANDATORY STRUCTURE — DO NOT CHANGE
=====================

HEADER (each on its own line, ONLY if available):
- Full name (always include)
- City (always include)
- Email (always include)
- Phone (always include)
- Date (always include)
- Company name (ONLY if clearly stated in job offer)

SALUTATION:
- Use the recruiter or hiring manager name if provided
- Otherwise use the standard formal greeting of the detected language

OPENING PARAGRAPH (1 paragraph):
- State the position applied for
- Mention the company name if available
- Briefly summarize the candidate profile

BODY PARAGRAPHS (2–3 paragraphs):
- Highlight relevant experience and skills
- Connect candidate experience to job requirements
- Use concrete examples when possible
- Stay strictly within CV content

CLOSING PARAGRAPH (1 paragraph):
- Express motivation for the company
- Emphasize contribution and fit
- Use culturally appropriate closing tone

SIGN-OFF:
- Use the standard professional sign-off of the detected language
- Candidate full name (always include)

=====================
INPUT DATA
=====================

Candidate:
- Name: Resume owner name
- City: Resume owner city
- Email: Resume owner email
- Phone: Resume owner phone

Date: ${today}

Job Offer:
${jobDescription}

Candidate CV:
${safeCv}

=====================
FINAL INSTRUCTION
=====================

Generate the FINAL cover letter now.
Strictly follow the structure above.
Do NOT include explanations, comments, or placeholders.
`;
}
