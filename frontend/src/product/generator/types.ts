// frontend/src/product/generator/types.ts
export type GenerateType = "cv" | "coverLetter";

export interface GenerateResponse {
  content?: string;
  result?: string;
}
