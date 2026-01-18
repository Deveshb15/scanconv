"use client";

import { useState } from "react";

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
  disabled?: boolean;
  filename?: string;
}

export function DownloadButton({ onDownload, disabled, filename }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    if (disabled || isDownloading) return;

    setIsDownloading(true);
    try {
      await onDownload();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || isDownloading}
        className={`
          rounded-lg px-6 py-3 text-sm font-medium transition-colors
          ${disabled
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
          }
        `}
      >
        {isDownloading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
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
            Creating PDF...
          </span>
        ) : (
          "Download PDF"
        )}
      </button>

      {filename && !disabled && (
        <p className="text-xs text-neutral-400">
          {filename.replace(/\.[^/.]+$/, "")}-scanned.pdf
        </p>
      )}
    </div>
  );
}
