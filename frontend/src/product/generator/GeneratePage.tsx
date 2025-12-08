import { useGenerator } from "../../hooks/useGenerator";
import type { GenerateType } from "./types";

import Card from "../../components/ui/Card";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

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

        {/* CV Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">
            Upload Your CV (PDF / DOCX / TXT)
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleCVUpload}
            className="block cursor-pointer"
          />

          {cvText && (
            <p className="text-green-600 mt-2 font-medium">
              ✔ CV scanned successfully
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="primary"
            onClick={() => onGenerateClick("cv")}
            loading={isLoading && lastType === "cv"}
          >
            Generate CV (Text)
          </Button>

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

          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={!generatedText || lastType === "coverLetter"}
          >
            Download CV (Text)
          </Button>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}
      </Card>
    </div>
  );
}
