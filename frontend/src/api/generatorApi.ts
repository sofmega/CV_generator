// frontend/src/api/generatorApi.ts
import type { GenerateType } from "../product/generator/types";
import { API_BASE_URL, getAuthHeaders, getJWT } from "../lib/api";

export async function extractCvText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file); // MUST match multer.single("cv")

  // We CANNOT attach Authorization header with FormData
  const token = await getJWT();

  const res = await fetch(`${API_BASE_URL}/extract-cv?token=${token}`, {
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

  const authHeaders = await getAuthHeaders();

  // === CV TEXT ===
  if (type === "cv") {
    const res = await fetch(`${API_BASE_URL}/cv/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    if (!res.ok) throw new Error("Server error while generating CV text.");

    const data = await res.json();
    const result = data.content || data.result;
    if (!result) throw new Error("No generated CV content received.");

    return { text: result };
  }

  // === CV PDF ===
  if (type === "cv-pdf") {
    const res = await fetch(`${API_BASE_URL}/cv/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    if (!res.ok) throw new Error("Server error while generating CV PDF.");

    return { pdfBlob: await res.blob() };
  }

  // === COVER LETTER PDF ===
  if (type === "coverLetter") {
    const res = await fetch(`${API_BASE_URL}/lm/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    if (!res.ok)
      throw new Error("Server error while generating cover letter PDF.");

    return { pdfBlob: await res.blob() };
  }

  throw new Error("Unknown generation type.");
}
