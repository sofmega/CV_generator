// src/product/generator/components/Step1Upload.tsx
type Step1UploadProps = {
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
  error: string | null;
};

export default function Step1Upload({ onUpload, error }: Step1UploadProps) {
  return (
    <div>
      <p className="text-gray-700 mb-6 text-lg">
        First, <span className="font-bold">upload your resume</span> in order to
        fully customize your cover letter / CV.
      </p>

      <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center">
        <p className="text-gray-700 mb-2">Drop your resume here or choose a file.</p>

        <p className="text-sm text-gray-500 mb-6">
          PDF, DOCX or TXT. 
        </p>

        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onUpload}
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
          <span>All submitted data is deleted automatically after completion.</span>
        </div>
      </div>

      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
    </div>
  );
}
