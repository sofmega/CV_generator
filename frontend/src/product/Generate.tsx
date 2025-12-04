// frontend/src/product/Generate.tsx
import { useState } from "react";

type GenerateType = "cv" | "coverLetter";

interface GenerateResponse {
  content?: string;
  result?: string;
}

export default function CRUDTable() {
  const [jobOffer, setJobOffer] = useState("");
  const [cvText, setCvText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastType, setLastType] = useState<GenerateType | null>(null);

  // ---------------------------
  //   CV Upload
  // ---------------------------
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await fetch("http://localhost:3000/extract-cv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to extract text from CV.");

      const data = await res.json();
      if (!data.text) throw new Error("CV extraction returned no text.");

      setCvText(data.text);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ---------------------------
  //   Generate CV / Cover Letter
  // ---------------------------
  const handleGenerate = async (type: GenerateType) => {
    if (!jobOffer.trim()) {
      setError("Please paste the job offer first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedText("");
    setLastType(type);

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobOffer,
          cvText,
          type: type === "coverLetter" ? "cover-letter-pdf" : "cv",
        }),
      });

      if (!res.ok) throw new Error("Server error while generating.");

      // ---- PDF FLOW ----
      if (type === "coverLetter") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Cover_Letter.pdf";
        a.click();

        URL.revokeObjectURL(url);
        return;
      }

      // ---- TEXT FLOW (CV) ----
      const data: GenerateResponse = await res.json();
      const result = data.content || data.result;

      if (!result) throw new Error("No generated content received.");

      setGeneratedText(result);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------
  //   Download TXT (CV only)
  // ---------------------------
  const handleDownload = () => {
    if (!generatedText) return;

    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.txt";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // Styles
  const container = { padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" };
  const label = { fontWeight: "bold", marginBottom: 6, display: "block" };
  const textarea = { width: "100%", minHeight: 150, padding: 10, marginBottom: 16 };
  const btnRow = { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" };
  const btn = { padding: "10px 18px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer" };
  const btnPrimary = { ...btn, background: "#007bff", color: "white", borderColor: "#007bff" };
  const btnDisabled = { ...btnPrimary, opacity: 0.6, cursor: "not-allowed" };

  return (
    <div style={container}>
      <h1>AI Job Application Assistant</h1>

      {/* Job Offer */}
      <label style={label}>Job Offer</label>
      <textarea
        style={textarea}
        placeholder="Paste job offer..."
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
      />

      {/* Upload */}
      <label style={label}>Upload Your CV (PDF / DOCX / TXT)</label>
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleCVUpload} />

      {cvText && (
        <p style={{ background: "#f4f4f4", padding: 10, borderRadius: 5, marginTop: 10 }}>
          ✔ CV scanned successfully
        </p>
      )}

      {/* Buttons */}
      <div style={btnRow}>
        <button
          style={isLoading ? btnDisabled : btnPrimary}
          onClick={() => handleGenerate("cv")}
          disabled={isLoading}
        >
          {isLoading && lastType === "cv" ? "Generating CV..." : "Generate CV"}
        </button>

        <button
          style={isLoading ? btnDisabled : btnPrimary}
          onClick={() => handleGenerate("coverLetter")}
          disabled={isLoading}
        >
          {isLoading && lastType === "coverLetter" ? "Generating LM..." : "Generate Cover Letter"}
        </button>

        <button
          style={lastType === "coverLetter" || !generatedText ? btnDisabled : btn}
          onClick={handleDownload}
          disabled={!generatedText || lastType === "coverLetter"}
        >
          Download Result
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
