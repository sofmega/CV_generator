import Card from "../../components/ui/Card";
import { useGenerator } from "../../hooks/useGenerator";

import Stepper from "./components/Stepper";
import Step1Upload from "./components/Step1Upload";
import Step2Uploading from "./components/Step2Uploading";
import Step3JobOffer from "./components/Step3JobOffer";
import Step4Result from "./components/Step4Result";
import type { GenerateType } from "./types";

type GenerateMode = "cv" | "coverLetter";

type Props = {
  mode: GenerateMode;
};

export function GeneratePage({ mode }: Props) {
  const {
    step,
    setStep,
    resetAll,

    jobOffer,
    setJobOffer,

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
  } = useGenerator();

  const title =
    mode === "cv" ? "Free AI CV Generator" : "Free AI Cover Letter Generator";

  const subtitle =
    mode === "cv"
      ? "Generate a tailored CV (PDF) optimized for the job offer."
      : "Generate a tailored cover letter (PDF) optimized for the job offer.";

  const primaryType: GenerateType = mode === "cv" ? "cv-pdf" : "coverLetter";
  const primaryButtonLabel = mode === "cv" ? "Generate CV" : "Generate Cover Letter";

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-blue-700 font-semibold tracking-wide">
            GENERATE AS MANY DOCUMENTS AS YOU NEED
          </p>
          <h1 className="text-4xl font-black text-gray-900 mt-2">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        <Card className="w-full p-8 rounded-3xl shadow-lg">
          {step !== 4 && <Stepper step={step} />}

          {step === 1 && <Step1Upload onUpload={handleCVUpload} error={error} />}

          {step === 2 && (
            <Step2Uploading
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              uploadedFileName={uploadedFileName}
              onCancel={resetAll}
              error={error}
            />
          )}

          {step === 3 && (
            <Step3JobOffer
              jobOffer={jobOffer}
              setJobOffer={setJobOffer}
              onBack={() => setStep(1)}
              onGenerate={() => handleGenerate(primaryType)}
              isLoading={isLoading}
              buttonLabel={primaryButtonLabel}
              error={error}
            />
          )}

          {step === 4 && (
            <Step4Result
              generatedText={generatedText}
              setGeneratedText={setGeneratedText}
              generatedPdfBlob={generatedPdfBlob}
              pdfPreviewUrl={pdfPreviewUrl}
              lastType={lastType}
              onBack={() => setStep(3)}
              onReset={resetAll}
              onDownloadText={downloadText}
              onDownloadPdf={downloadPdf}
              error={error}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
