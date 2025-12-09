// src/features/generator/useGenerator.ts

import { useState } from "react";
import type { ChangeEvent } from "react";
import { extractCvText, generateDocument } from "../api/generatorApi";
import type { GenerateType } from "../product/generator/types";
import { useNavigate } from "react-router-dom";
import type { ApiError } from "../lib/api";

export function useGenerator() {
  const navigate = useNavigate();

  const [jobOffer, setJobOffer] = useState("");
  const [cvText, setCvText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastType, setLastType] = useState<GenerateType | null>(null);

  // ---------------------------------------------------------------------------
  // Upload CV
  // ---------------------------------------------------------------------------
  const handleCVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const text = await extractCvText(file);
      setCvText(text);
    } catch (err: unknown) {
      const apiErr = err as ApiError;

      if (typeof apiErr.status === "number" && apiErr.status === 401) {
        navigate("/login");
        return;
      }

      setError(apiErr.message);
    }
  };

  // ---------------------------------------------------------------------------
  // Generate document (CV or Cover Letter)
  // ---------------------------------------------------------------------------
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

      // PDF
      if (result.pdfBlob) {
        const url = URL.createObjectURL(result.pdfBlob);
        const a = document.createElement("a");
        a.href = url;

        a.download = type === "cv-pdf" ? "CV.pdf" : "Cover_Letter.pdf";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      // Text
      if (result.text) {
        setGeneratedText(result.text);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;

      if (apiErr.status === 401) {
        navigate("/login");
        return;
      }

      setError(apiErr.message || "Generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Download text result
  // ---------------------------------------------------------------------------
  const handleDownload = () => {
    if (!generatedText) return;

    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
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
