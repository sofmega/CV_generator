// src/product/generator/components/Step4Result.tsx
import { lazy, Suspense } from "react";
import Button from "../../../components/ui/Button";
import type { GenerateType } from "../types";

const PdfViewer = lazy(() => import("../../../components/pdf/PdfViewer"));

type Step4ResultProps = {
  generatedText: string;
  setGeneratedText: (v: string) => void;

  generatedPdfBlob: Blob | null;
  pdfPreviewUrl: string | null;

  lastType: GenerateType | null;

  onBack: () => void;
  onReset: () => void;

  onDownloadText: (filename: string) => void;
  onDownloadPdf: (filename: string) => void;

  error: string | null;
};

export default function Step4Result({
  generatedText,
  setGeneratedText,
  generatedPdfBlob,
  pdfPreviewUrl,
  lastType,
  onBack,
  onReset,
  onDownloadText,
  onDownloadPdf,
  error,
}: Step4ResultProps) {
  const pdfFileName =
    lastType === "cv-pdf" ? "CV.pdf" : "Cover_Letter.pdf";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black text-gray-900">Your generated document</h2>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="secondary" onClick={onReset}>
            Start over
          </Button>
        </div>
      </div>

      {/* TEXT RESULT */}
      {generatedText && (
        <div className="border rounded-2xl overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              Editable text output
            </div>

            <Button onClick={() => onDownloadText("Generated.txt")} className="px-4 py-2">
              Download
            </Button>
          </div>

          <textarea
            className="w-full min-h-[360px] outline-none resize-y p-4 text-gray-800"
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
          />
        </div>
      )}

      {/* PDF RESULT */}
      {generatedPdfBlob && pdfPreviewUrl && (
        <div className="border rounded-2xl overflow-hidden bg-white mt-6">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">PDF preview</div>

            <Button onClick={() => onDownloadPdf(pdfFileName)} className="px-4 py-2">
              Download PDF
            </Button>
          </div>

          <div className="p-4">
            <Suspense fallback={<div className="text-gray-600">Loading preview…</div>}>
              <PdfViewer url={pdfPreviewUrl} />
            </Suspense>
          </div>
        </div>
      )}

      {!generatedText && !generatedPdfBlob && (
        <p className="text-gray-600">No output to display.</p>
      )}

      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
    </div>
  );
}
