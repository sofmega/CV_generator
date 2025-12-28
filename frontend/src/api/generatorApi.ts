// frontend/src/api/generatorApi.ts
import { API_BASE_URL, getJWT, request, getAuthHeaders } from "../lib/api";
import type { GenerateType } from "../product/generator/types";

interface ExtractCvResponse {
  text: string;
}

interface GenerateTextResponse {
  content?: string;
  result?: string;
}

export async function extractCvText(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("cv", file);

  const token = await getJWT();

  // Use XHR to get upload progress
  const text = await new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/extract-cv`);

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const percent = Math.round((evt.loaded / evt.total) * 100);
      onProgress?.(percent);
    };

    xhr.onload = () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const json = JSON.parse(xhr.responseText) as ExtractCvResponse;
          resolve(json.text);
        } else {
          reject(Object.assign(new Error("Upload failed"), { status: xhr.status }));
        }
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = () => reject(Object.assign(new Error("Network error"), { status: 0 }));
    xhr.send(formData);
  });

  return text;
}

export async function generateDocument(params: {
  jobOffer: string;
  cvText: string;
  type: GenerateType;
}): Promise<{ text?: string; pdfBlob?: Blob }> {
  const { jobOffer, cvText, type } = params;
  const authHeaders = await getAuthHeaders();

  if (type === "cv") {
    const data = await request<GenerateTextResponse>(`${API_BASE_URL}/cv/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });

    return { text: data.content || data.result };
  }

  if (type === "cv-pdf") {
    const res = await request<Response>(`${API_BASE_URL}/cv/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });
    return { pdfBlob: await res.blob() };
  }

  if (type === "coverLetter") {
    const res = await request<Response>(`${API_BASE_URL}/lm/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ jobDescription: jobOffer, cvText }),
    });
    return { pdfBlob: await res.blob() };
  }

  // (Future) coverLetterText endpoint
  if (type === "coverLetterText") {
    // Example future endpoint:
    // const data = await request<GenerateTextResponse>(`${API_BASE_URL}/lm/text`, {...})
    // return { text: data.content || data.result };
    throw new Error("coverLetterText is not available yet (backend missing /lm/text).");
  }

  throw new Error("Unknown generation type.");
}
