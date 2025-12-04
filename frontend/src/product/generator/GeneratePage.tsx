// frontend/src/product/generator/GeneratePage.tsx
import { useGenerator } from "./useGenerator";
import type { GenerateType } from "./types";
import "../../styles/generator.css";

export function GeneratePage() {
  const {
    jobOffer,
    cvText,
    generatedText,
    isLoading,
    error,
    lastType,
    setJobOffer,
    handleCVUpload,
    handleGenerate,
    handleDownload,
  } = useGenerator();

  const onGenerateClick = (type: GenerateType) => {
    handleGenerate(type);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">AI Job Application Assistant</h1>

      {/* Job Offer */}
      <div className="field">
        <label className="field-label">Job Offer</label>
        <textarea
          className="textarea"
          placeholder="Paste job offer..."
          value={jobOffer}
          onChange={(e) => setJobOffer(e.target.value)}
        />
      </div>

      {/* CV Upload */}
      <div className="field">
        <label className="field-label">Upload Your CV (PDF / DOCX / TXT)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleCVUpload}
        />
      </div>

      {cvText && (
        <p className="info-banner">✔ CV scanned successfully</p>
      )}

      {/* Buttons */}
      <div className="button-row">
        <button
          className={`btn btn-primary ${isLoading ? "btn-disabled" : ""}`}
          onClick={() => onGenerateClick("cv")}
          disabled={isLoading}
        >
          {isLoading && lastType === "cv" ? "Generating CV..." : "Generate CV"}
        </button>

        <button
          className={`btn btn-primary ${isLoading ? "btn-disabled" : ""}`}
          onClick={() => onGenerateClick("coverLetter")}
          disabled={isLoading}
        >
          {isLoading && lastType === "coverLetter"
            ? "Generating LM..."
            : "Generate Cover Letter"}
        </button>

        <button
          className={`btn ${
            lastType === "coverLetter" || !generatedText
              ? "btn-disabled"
              : ""
          }`}
          onClick={handleDownload}
          disabled={!generatedText || lastType === "coverLetter"}
        >
          Download Result
        </button>
      </div>

      {/* Error */}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
