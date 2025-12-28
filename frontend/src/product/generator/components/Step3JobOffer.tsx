// src/product/generator/components/Step3JobOffer.tsx
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";
import type { GenerateType } from "../types";

type Step3JobOfferProps = {
  jobOffer: string;
  setJobOffer: (v: string) => void;

  onBack: () => void;
  onGenerate: (type: GenerateType) => void;

  isLoading: boolean;
  lastType: GenerateType | null;
  error: string | null;
};

export default function Step3JobOffer({
  jobOffer,
  setJobOffer,
  onBack,
  onGenerate,
  isLoading,
  lastType,
  error,
}: Step3JobOfferProps) {
  return (
    <div>
      <p className="text-gray-700 mb-6 text-lg">
        Now, paste the <span className="font-bold">job description</span> (or the entire job ad).
      </p>

      <Textarea
        label=""
        placeholder="Paste here..."
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
        className="h-52"
      />

      <div className="mt-6 flex flex-wrap gap-4 justify-end">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>

        <Button
          onClick={() => onGenerate("cv")}
          loading={isLoading && lastType === "cv"}
        >
          Generate CV
        </Button>

        <Button
          onClick={() => onGenerate("coverLetter")}
          loading={isLoading && lastType === "coverLetter"}
        >
          Generate Cover Letter
        </Button>
      </div>

      {/* future button (only if backend exists) */}
      {/* 
      <div className="mt-3 flex justify-end">
        <Button
          variant="secondary"
          onClick={() => onGenerate("coverLetterText")}
          loading={isLoading && lastType === "coverLetterText"}
        >
          Generate Cover Letter (Text)
        </Button>
      </div>
      */}

      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
    </div>
  );
}
