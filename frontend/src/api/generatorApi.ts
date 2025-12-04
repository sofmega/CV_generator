// src/api/generatorApi.ts
import type { GenerateType, GenerateResponse } from "../features/generator/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function extractCvText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file);

  const res = await fetch(`${API_BASE_URL}/extract-cv`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to extract text from CV.");
  }

  const data = await res.json();
  if (!data.text) {
    throw new Error("CV extraction returned no text.");
  }

  return data.text as string;
}

export interface GenerateDocumentParams {
  jobOffer: string;
  cvText: string;
  type: GenerateType;
}

export interface GenerateDocumentResult {
  text?: string;
  pdfBlob?: Blob;
}

export async function generateDocument(
  params: GenerateDocumentParams
): Promise<GenerateDocumentResult> {
  const { jobOffer, cvText, type } = params;

  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription: jobOffer,
      cvText,
      type: type === "coverLetter" ? "cover-letter-pdf" : "cv",
    }),
  });

  if (!res.ok) {
    throw new Error("Server error while generating.");
  }

  // Cover letter → PDF
  if (type === "coverLetter") {
    const pdfBlob = await res.blob();
    return { pdfBlob };
  }

  // CV → text (JSON)
  const data: GenerateResponse = await res.json();
  const result = data.content || data.result;

  if (!result) {
    throw new Error("No generated content received.");
  }

  return { text: result };
}
