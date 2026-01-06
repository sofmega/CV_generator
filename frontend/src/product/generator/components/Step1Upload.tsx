// frontend/src/product/generator/components/Step1Upload.tsx
import { useRef, useState } from "react";
import type React from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

type Step1UploadProps = {
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
  error: string | null;
};

export default function Step1Upload({ onUpload, error }: Step1UploadProps) {
  const { user, loading } = useAuthContext();
  const isAuthed = !!user && !loading;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const onUploadButtonClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (!isAuthed) {
      e.preventDefault(); // prevents opening file picker
      setAuthModalOpen(true);
    }
  };

  return (
    <div>
      <p className="text-gray-700 mb-6 text-lg">
        First, <span className="font-bold">upload your resume</span> in order to
        fully customize your cover letter / CV.
      </p>

      <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center">
        <p className="text-gray-700 mb-2">Drop your resume here or choose a file.</p>

        <p className="text-sm text-gray-500 mb-6">PDF, DOCX or TXT.</p>

        <input
          ref={inputRef}
          id="cv-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onUpload}
          className="hidden"
        />

        <label
          htmlFor="cv-upload"
          onClick={onUploadButtonClick}
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

      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthed={() => {
          // Note: auto-opening the file picker after async login is often blocked by browsers.
          // So we just close the modal and the user clicks Upload again.
        }}
      />
    </div>
  );
}
