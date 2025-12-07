// frontend/src/api/generatorApi.ts
import type { GenerateType, GenerateResponse } from "../product/generator/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function extractCvText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file); // MUST match multer.single("cv")

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

  // === CV TEXT ===
  if (type === "cv") {
    const res = await fetch(`${API_BASE_URL}/cv/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: jobOffer,
        cvText,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error while generating CV text.");
    }

    const data: GenerateResponse = await res.json();
    const result = data.content || data.result;

    if (!result) {
      throw new Error("No generated CV content received.");
    }

    return { text: result };
  }

  // === CV PDF ===
  if (type === "cv-pdf") {
    const res = await fetch(`${API_BASE_URL}/cv/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: jobOffer,
        cvText,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error while generating CV PDF.");
    }

    const pdfBlob = await res.blob();
    return { pdfBlob };
  }

  // === COVER LETTER (PDF) – updated to match backend ===
  if (type === "coverLetter") {
    const res = await fetch(`${API_BASE_URL}/lm/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: jobOffer,
        cvText,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error while generating cover letter PDF.");
    }

    const pdfBlob = await res.blob();
    return { pdfBlob };
  }

  throw new Error("Unknown generation type.");
}
