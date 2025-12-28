// frontend/src/product/generator/types.ts
export type GenerateType = "cv" | "cv-pdf" | "coverLetter" | "coverLetterText";

export interface GenerateResponse {
  content?: string;
  result?: string;
}
