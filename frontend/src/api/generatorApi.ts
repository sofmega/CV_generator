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

  if (!res.ok) throw new Error("Failed to extract text from CV.");

  const data = await res.json();
  return data.text as string;
}

export interface GenerateDocumentParams {
  jobOffer: string;
  cvText: string;
  type: GenerateType; // "cv" | "cv-pdf" | "coverLetter"
}

export interface GenerateDocumentResult {
  text?: string;
  pdfBlob?: Blob;
}

export async function generateDocument(
  params: GenerateDocumentParams
): Promise<GenerateDocumentResult> {
  const { jobOffer, cvText, type } = params;

  // Map frontend type → backend endpoint
  let endpoint = "";
  let isPdf = false;

  if (type === "cv") {
    endpoint = "/cv/text";
  } else if (type === "cv-pdf") {
    endpoint = "/cv/pdf";
    isPdf = true;
  } else if (type === "coverLetter") {
    endpoint = "/lm/pdf";
    isPdf = true;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription: jobOffer,
      cvText,
    }),
  });

  if (!res.ok) throw new Error("Server error while generating.");

  if (isPdf) {
    const pdfBlob = await res.blob();
    return { pdfBlob };
  }

  const data: GenerateResponse = await res.json();
  return { text: data.result };
}
