// frontend/src/components/ui/PdfViewer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// ✅ IMPORTANT: set the worker (Vite-friendly)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfViewerProps = {
  url: string; // blob url (ObjectURL) or any pdf url
  className?: string;
};

export default function PdfViewer({ url, className }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const [zoom, setZoom] = useState(1.1); // start slightly zoomed
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPrev = pageNum > 1;
  const canNext = numPages > 0 && pageNum < numPages;

  // Load PDF
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setPdf(null);
        setNumPages(0);
        setPageNum(1);

        const task = pdfjsLib.getDocument({ url });
        const loaded = await task.promise;

        if (cancelled) return;

        setPdf(loaded);
        setNumPages(loaded.numPages);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to load PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Render page
  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!pdf || !canvasRef.current) return;

      try {
        setRendering(true);
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: zoom });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // handle DPR for crisp text
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        const renderTask = page.render({
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to render page");
      } finally {
        if (!cancelled) setRendering(false);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [pdf, pageNum, zoom]);

  const zoomLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom]);

  return (
    <div className={["w-full", className || ""].join(" ")}>
      {/* Custom toolbar (your UI) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b bg-gray-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={!canPrev || loading || rendering}
          >
            ←
          </button>

          <div className="text-sm text-gray-700 min-w-[90px] text-center">
            {numPages > 0 ? (
              <>
                {pageNum} / {numPages}
              </>
            ) : (
              "— / —"
            )}
          </div>

          <button
            className="px-3 py-1 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
            disabled={!canNext || loading || rendering}
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))}
            disabled={loading || rendering}
          >
            −
          </button>

          <div className="text-sm text-gray-700 min-w-[70px] text-center">
            {zoomLabel}
          </div>

          <button
            className="px-3 py-1 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setZoom((z) => Math.min(2.0, +(z + 0.1).toFixed(2)))}
            disabled={loading || rendering}
          >
            +
          </button>

          <button
            className="px-3 py-1 rounded-lg border bg-white"
            onClick={() => setZoom(1.1)}
            disabled={loading || rendering}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas viewport */}
      <div className="rounded-b-2xl bg-white border border-t-0 overflow-auto">
        <div className="min-h-[560px] flex items-start justify-center p-6">
          {loading && (
            <div className="text-gray-600">Loading PDF…</div>
          )}

          {!loading && error && (
            <div className="text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <canvas ref={canvasRef} />
          )}
        </div>
      </div>
    </div>
  );
}
