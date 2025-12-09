// frontend/src/api/generatorApi.ts

import type { GenerateType } from "../product/generator/types";
import { API_BASE_URL, getAuthHeaders, getJWT, request } from "../lib/api";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
interface ExtractCvResponse {
  text: string;
}

interface GenerateTextResponse {
  content?: string;
  result?: string;
}

// -----------------------------------------------------------------------------
// Extract CV Text
// -----------------------------------------------------------------------------
export async function extractCvText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file);

  const token = await getJWT();

  const data = await request<ExtractCvResponse>(`${API_BASE_URL}/extract-cv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return data.text;
}

// -----------------------------------------------------------------------------
// Generate Document
// -----------------------------------------------------------------------------
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
  const authHeaders = await getAuthHeaders();

  // === CV TEXT ===
  if (type === "cv") {
    const data = await request<GenerateTextResponse>(`${API_BASE_URL}/cv/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    const result = data.content || data.result;
    return { text: result };
  }

  // === CV PDF ===
  if (type === "cv-pdf") {
    const res = await request<Response>(`${API_BASE_URL}/cv/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    return { pdfBlob: await res.blob() };
  }

  // === COVER LETTER PDF ===
  if (type === "coverLetter") {
    const res = await request<Response>(`${API_BASE_URL}/lm/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    return { pdfBlob: await res.blob() };
  }

  throw new Error("Unknown generation type.");
}
