// src/features/generator/useGenerator.ts
import { useState } from "react";
import type { ChangeEvent } from "react";
import { extractCvText, generateDocument } from "../../api/generatorApi";
import type { GenerateType } from "./types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unexpected error occurred.";
}

export function useGenerator() {
  const [jobOffer, setJobOffer] = useState("");
  const [cvText, setCvText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastType, setLastType] = useState<GenerateType | null>(null);

  const handleCVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const text = await extractCvText(file);
      setCvText(text);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

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
      const result = await generateDocument({
        jobOffer,
        cvText,
        type,
      });

      // PDF download (CV or LM)
      if (result.pdfBlob) {
        const url = URL.createObjectURL(result.pdfBlob);
        const a = document.createElement("a");
        a.href = url;

        a.download =
          type === "cv-pdf" ? "CV.pdf" : "Cover_Letter.pdf";

        a.click();
        URL.revokeObjectURL(url);

        return;
      }

      // Text CV (classic)
      if (result.text) {
        setGeneratedText(result.text);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedText) return;

    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return {
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
  };
}
