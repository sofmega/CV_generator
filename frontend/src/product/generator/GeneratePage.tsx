// frontend/src/product/generator/GeneratePage.tsx
import { useState } from "react";
import { useGenerator } from "../../hooks/useGenerator";
import type { GenerateType } from "./types";

import Card from "../../components/ui/Card";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

export function GeneratePage() {
  const {
    jobOffer,
    cvText,
    isLoading,
    error,
    lastType,
    setJobOffer,
    handleCVUpload,
    handleGenerate,
  } = useGenerator();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const onGenerateClick = (type: GenerateType) => {
    handleGenerate(type);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          AI Job Application Assistant
        </h1>

        <p className="text-gray-600 mb-8">
          Generate a tailored CV or cover letter instantly using AI.
        </p>

        {/* Job Offer */}
        <div className="mb-6">
          <Textarea
            label="Job Offer"
            placeholder="Paste the job offer..."
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            className="h-40"
          />
        </div>

        {/* CV Upload (Professional button) */}
        <div className="mb-6">
          <label className="block font-semibold mb-3 text-gray-700">
            Upload Your CV (PDF / DOCX / TXT)
          </label>

          {/* Hidden native input */}
          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleCVUpload}
            className="hidden"
          />

          {/* Styled button */}
          <label
            htmlFor="cv-upload"
            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-md cursor-pointer hover:bg-indigo-700 transition"
          >
            Upload your CV
          </label>

          {/* Status text */}
          <p className="text-sm text-gray-500 mt-2">
            {cvText ? "File selected ✅" : "No file selected"}
          </p>

          {cvText && (
            <p className="text-green-600 mt-2 font-medium">
              ✔ CV scanned successfully
            </p>
          )}
        </div>

        {/* MAIN ACTIONS (only 2 visible) */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="primary"
            onClick={() => onGenerateClick("cv-pdf")}
            loading={isLoading && lastType === "cv-pdf"}
          >
            Generate CV (PDF)
          </Button>

          <Button
            variant="primary"
            onClick={() => onGenerateClick("coverLetter")}
            loading={isLoading && lastType === "coverLetter"}
          >
            Generate Cover Letter (PDF)
          </Button>
        </div>

        {/* ADVANCED TOGGLE */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm text-gray-600 hover:text-gray-900 underline mb-4"
        >
          {showAdvanced ? "Hide advanced options" : "Advanced options"}
        </button>

        {/* ADVANCED OPTIONS */}
        {showAdvanced && (
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-md border">
            <Button
              variant="secondary"
              onClick={() => onGenerateClick("cv")}
              loading={isLoading && lastType === "cv"}
            >
              Generate CV (Text)
            </Button>

            {/* If you later add a real cover-letter-text type, we can add it here */}
          </div>
        )}

        {error && <p className="text-red-600 font-medium">{error}</p>}
      </Card>
    </div>
  );
}
