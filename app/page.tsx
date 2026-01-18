"use client";

import { ImageUploader } from "@/components/ImageUploader";
import { ScanPreview } from "@/components/ScanPreview";
import { DownloadButton } from "@/components/DownloadButton";
import { useImageProcessor } from "@/hooks/useImageProcessor";

export default function Home() {
  const {
    originalImage,
    processedImage,
    isProcessing,
    isGeneratingPdf,
    error,
    filename,
    handleImageSelect,
    handleDownload,
    reset,
  } = useImageProcessor();

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-xl px-4 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900">
            ScanConv
          </h1>
          <p className="text-sm text-neutral-500">
            Document scanner with edge detection
          </p>
        </header>

        {/* Error display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Main content */}
        <div className="space-y-8">
          {/* Image Uploader */}
          {!originalImage ? (
            <ImageUploader
              onImageSelect={handleImageSelect}
              disabled={isProcessing}
            />
          ) : (
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Upload different image
              </button>
            </div>
          )}

          {/* Preview */}
          {originalImage && (
            <ScanPreview
              originalImage={originalImage}
              processedImage={processedImage}
              isProcessing={isProcessing}
            />
          )}

          {/* Download Button */}
          {processedImage && !isProcessing && (
            <div className="flex justify-center">
              <DownloadButton
                onDownload={handleDownload}
                disabled={isGeneratingPdf}
                filename={filename || undefined}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-xs text-neutral-400">
          <p>Detects edges, removes background, applies B&W threshold</p>
        </footer>
      </main>
    </div>
  );
}
