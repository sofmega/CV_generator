import Card from "../../components/ui/Card";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useGenerator } from "../../hooks/useGenerator";
import PdfViewer from "../../components/ui/pdf/PdfViewer";

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-6 mb-8">
      {[1, 2, 3].map((n) => {
        const done = step > n;
        const active = step === n;

        return (
          <div key={n} className="flex items-center gap-3">
            <div
              className={[
                "w-9 h-9 rounded-full flex items-center justify-center font-bold",
                done ? "bg-emerald-500 text-white" : "",
                active ? "bg-blue-600 text-white" : "",
                !done && !active ? "bg-blue-100 text-blue-700" : "",
              ].join(" ")}
            >
              {done ? "✓" : n}
            </div>

            {n !== 3 && (
              <div className="w-16 h-1 rounded bg-blue-100 overflow-hidden">
                <div
                  className={[
                    "h-full transition-all",
                    step > n ? "w-full bg-blue-600" : "w-0 bg-blue-600",
                  ].join(" ")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function GeneratePage() {
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

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-blue-700 font-semibold tracking-wide">
            GENERATE AS MANY DOCUMENTS AS YOU NEED
          </p>
          <h1 className="text-4xl font-black text-gray-900 mt-2">
            Free AI Cover Letter Generator
          </h1>
        </div>

        <Card className="w-full p-8 rounded-3xl shadow-lg">
          {step !== 4 && <Stepper step={step} />}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <p className="text-gray-700 mb-6 text-lg">
                First, <span className="font-bold">upload your resume</span> in order to
                fully customize your cover letter / CV.
              </p>

              <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center">
                <p className="text-gray-700 mb-2">
                  Drop your resume here or choose a file.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  PDF & DOCX only. Max 2MB file size.
                </p>

                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleCVUpload}
                  className="hidden"
                />

                <label
                  htmlFor="cv-upload"
                  className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-md cursor-pointer hover:bg-blue-700 transition"
                >
                  Upload Your Resume
                </label>

                <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  <span>
                    We will never share your data with 3rd parties or use it for AI training.
                  </span>
                </div>
              </div>

              {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div className="w-full border rounded-xl p-4 flex items-center justify-between gap-4 mb-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                    <span>
                      Uploading resume{uploadedFileName ? `: ${uploadedFileName}` : "..."}
                    </span>
                    <span className="text-gray-500">({uploadProgress}% complete)</span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-700 text-xl"
                  onClick={resetAll}
                  aria-label="Cancel upload"
                >
                  ×
                </button>
              </div>

              <div className="text-center text-gray-600">
                {isUploading ? "Extracting CV text, please wait…" : "Done!"}
              </div>

              {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
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
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>

                <Button
                  onClick={() => handleGenerate("cv")}
                  loading={isLoading && lastType === "cv"}
                >
                  Generate CV
                </Button>

                <Button
                  onClick={() => handleGenerate("coverLetter")}
                  loading={isLoading && lastType === "coverLetter"}
                >
                  Generate Cover Letter
                </Button>
              </div>

              {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Your generated document
                </h2>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button variant="secondary" onClick={resetAll}>
                    Start over
                  </Button>
                </div>
              </div>

              {/* TEXT RESULT (editable preview) */}
              {generatedText && (
                <>
                  <div className="border rounded-2xl overflow-hidden bg-white">
                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-700 font-medium">
                        Editable text output
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadText("Generated.txt")}
                          className="px-4 py-2"
                        >
                          Download
                        </Button>
                      </div>
                    </div>

                    <textarea
                      className="w-full min-h-[360px] outline-none resize-y p-4 text-gray-800"
                      value={generatedText}
                      onChange={(e) => setGeneratedText(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* PDF RESULT (✅ preview before download) */}
              {generatedPdfBlob && pdfPreviewUrl && (
  <>
    <div className="border rounded-2xl overflow-hidden bg-white">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-700 font-medium">
          PDF preview
        </div>

        <Button
          onClick={() =>
            downloadPdf(lastType === "cv-pdf" ? "CV.pdf" : "Cover_Letter.pdf")
          }
          className="px-4 py-2"
        >
          Download PDF
        </Button>
      </div>

      <div className="p-4">
        <PdfViewer url={pdfPreviewUrl} />
      </div>
    </div>
  </>
)}


              {!generatedText && !generatedPdfBlob && (
                <p className="text-gray-600">No output to display.</p>
              )}

              {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
