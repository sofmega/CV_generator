//  frontend/src/product/blog/posts.ts
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO or readable, your choice
  keywords?: string[];
  readingMinutes?: number;
  content: string; // simple text/markdown-like
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-tailor-your-cv-to-a-job-offer",
    title: "How to Tailor Your CV to a Job Offer (Step-by-Step)",
    description:
      "A practical guide to tailoring your CV to a job description: keywords, skills matching, impact bullets, and ATS tips.",
    date: "2026-01-06",
    keywords: ["tailor cv", "ats cv", "cv keywords", "resume tips"],
    readingMinutes: 7,
    content: `
Tailoring your CV means rewriting it for ONE job, not sending the same CV everywhere.

## 1) Extract keywords from the job offer
- Tools & technologies
- Job title synonyms
- Required skills and responsibilities

## 2) Update your headline + summary
Use the job’s role keywords naturally.

## 3) Reorder your skills section
Put the most relevant skills first.

## 4) Rewrite experience bullets using the job language
Use measurable impact:
- Improved X by Y%
- Reduced costs by Z
- Delivered feature in N weeks

## 5) Keep it ATS-friendly
- Simple headings (Experience, Skills, Education)
- Avoid tables and complex layouts
- Use standard fonts

If you want to generate a tailored CV instantly, use our AI CV Generator.
    `.trim(),
  },
  {
    slug: "ats-friendly-cv-what-it-is",
    title: "ATS-Friendly CV: What It Is and How to Pass Screening",
    description:
      "What ATS systems scan in your CV, common mistakes that break parsing, and a checklist to improve your pass rate.",
    date: "2026-01-06",
    keywords: ["ats friendly cv", "resume parsing", "cv format"],
    readingMinutes: 6,
    content: `
ATS = Applicant Tracking System. It parses your CV to extract skills, titles, and dates.

## ATS checklist
- Use one-column layout
- Avoid images inside the CV body
- Use clear section headings
- Use consistent date formats

## Common mistakes
- Tables for experience
- Icons for contact info
- Fancy PDF exported from design tools

A clean CV gets parsed better and increases interview chances.
    `.trim(),
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}
