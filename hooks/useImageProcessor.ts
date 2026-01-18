"use client";

import { useState, useCallback, useRef } from "react";
import { loadImage } from "@/lib/image/loader";
import { generatePdf, downloadPdf } from "@/lib/pdf/generator";
import { scanDocumentAPI, blobToDataUrl } from "@/lib/api/scan";

interface UseImageProcessorReturn {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  isGeneratingPdf: boolean;
  error: string | null;
  filename: string | null;
  handleImageSelect: (file: File) => Promise<void>;
  handleDownload: () => Promise<void>;
  reset: () => void;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const serverBlobRef = useRef<Blob | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);
    setFilename(file.name);
    setIsProcessing(true);

    try {
      // Load image for original preview
      const img = await loadImage(file);

      // Create original preview
      const originalCanvas = document.createElement("canvas");
      const maxPreviewSize = 1024;
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxPreviewSize || height > maxPreviewSize) {
        const scale = maxPreviewSize / Math.max(width, height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      originalCanvas.width = width;
      originalCanvas.height = height;
      const ctx = originalCanvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      setOriginalImage(originalCanvas.toDataURL("image/jpeg", 0.9));

      // Process with server API
      const blob = await scanDocumentAPI(file, {
        mode: "bw",
        blockSize: 15,
        offset: 10,
        format: "png",
        maxSize: 2048,
      });

      serverBlobRef.current = blob;
      const dataUrl = await blobToDataUrl(blob);
      setProcessedImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!serverBlobRef.current) {
      setError("No processed image available");
      return;
    }

    setIsGeneratingPdf(true);
    setError(null);

    try {
      const outputFilename = filename
        ? filename.replace(/\.[^/.]+$/, "-scanned.pdf")
        : "scanned-document.pdf";

      // Convert blob to canvas for PDF
      const img = new Image();
      const url = URL.createObjectURL(serverBlobRef.current);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pdfBytes = await generatePdf(canvas, "original");
      downloadPdf(pdfBytes, outputFilename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [filename]);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setIsGeneratingPdf(false);
    setError(null);
    setFilename(null);
    serverBlobRef.current = null;
  }, []);

  return {
    originalImage,
    processedImage,
    isProcessing,
    isGeneratingPdf,
    error,
    filename,
    handleImageSelect,
    handleDownload,
    reset,
  };
}
