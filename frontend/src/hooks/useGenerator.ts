import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { extractCvText, generateDocument } from "../api/generatorApi";
import type { GenerateType } from "../product/generator/types";
import type { ApiError } from "../lib/api";

type Step = 1 | 2 | 3 | 4;

export function useGenerator() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);

  const [jobOffer, setJobOffer] = useState("");
  const [cvText, setCvText] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [generatedText, setGeneratedText] = useState("");
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  // ✅ PDF preview URL (so user can SEE the generated PDF)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastType, setLastType] = useState<GenerateType | null>(null);

  const cleanupPdfUrl = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfPreviewUrl(null);
  };

  const resetAll = () => {
    cleanupPdfUrl();

    setStep(1);
    setJobOffer("");
    setCvText("");
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedFileName(null);
    setGeneratedText("");
    setGeneratedPdfBlob(null);
    setError(null);
    setIsLoading(false);
    setLastType(null);
  };

  const handleCVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadedFileName(file.name);

    // Step 2: uploading UI
    setStep(2);
    setIsUploading(true);
    setUploadProgress(1);

    try {
      const text = await extractCvText(file, (p) => setUploadProgress(p));
      setCvText(text);

      setIsUploading(false);
      setUploadProgress(100);

      // Done -> step 3
      setStep(3);
    } catch (err: unknown) {
      setIsUploading(false);

      const apiErr = err as ApiError;
      if (typeof apiErr?.status === "number" && apiErr.status === 401) {
        navigate("/login");
        return;
      }

      setError(apiErr?.message || "Upload failed. Please try again.");
      setStep(1);
    }
  };

  const handleGenerate = async (type: GenerateType) => {
    if (!jobOffer.trim()) {
      setError("Please paste the job description first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // reset outputs
    setGeneratedText("");
    setGeneratedPdfBlob(null);
    cleanupPdfUrl();

    setLastType(type);

    try {
      const result = await generateDocument({ jobOffer, cvText, type });

      if (result.pdfBlob) {
        const url = URL.createObjectURL(result.pdfBlob);
        setPdfPreviewUrl(url);
        setGeneratedPdfBlob(result.pdfBlob);
        setStep(4);
        return;
      }

      if (result.text) {
        setGeneratedText(result.text);
        setStep(4);
        return;
      }

      setError("No output returned from the server.");
    } catch (err: unknown) {
      const apiErr = err as ApiError;

      if (apiErr?.status === 401) {
        navigate("/login");
        return;
      }

      setError(apiErr?.message || "Generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadText = (filename: string) => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = (filename: string) => {
    if (!generatedPdfBlob) return;
    const url = URL.createObjectURL(generatedPdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    step,
    setStep,
    resetAll,

    jobOffer,
    setJobOffer,

    cvText,

    uploadProgress,
    isUploading,
    uploadedFileName,

    generatedText,
    setGeneratedText,

    generatedPdfBlob,
    pdfPreviewUrl,

    isLoading,
    error,
    lastType,

    handleCVUpload,
    handleGenerate,
    downloadText,
    downloadPdf,
  };
}
