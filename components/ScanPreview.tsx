"use client";

import { useState } from "react";

interface ScanPreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing?: boolean;
}

export function ScanPreview({
  originalImage,
  processedImage,
  isProcessing,
}: ScanPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const displayImage = showOriginal ? originalImage : processedImage;

  if (!originalImage) return null;

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
          <button
            onClick={() => setShowOriginal(true)}
            className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
              showOriginal
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setShowOriginal(false)}
            className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
              !showOriginal
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Scanned
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        {/* Loading */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-6 w-6 animate-spin text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-neutral-500">Processing...</p>
            </div>
          </div>
        )}

        {/* Image */}
        <div className="flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage || originalImage}
            alt={showOriginal ? "Original" : "Scanned"}
            className={`max-h-[60vh] max-w-full rounded object-contain transition-opacity ${
              isProcessing ? "opacity-50" : "opacity-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
