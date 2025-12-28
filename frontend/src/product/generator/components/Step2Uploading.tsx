// src/product/generator/components/Step2Uploading.tsx
type Step2UploadingProps = {
  uploadProgress: number;
  isUploading: boolean;
  uploadedFileName: string | null;
  onCancel: () => void;
  error: string | null;
};

export default function Step2Uploading({
  uploadProgress,
  isUploading,
  uploadedFileName,
  onCancel,
  error,
}: Step2UploadingProps) {
  return (
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
          onClick={onCancel}
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
  );
}
