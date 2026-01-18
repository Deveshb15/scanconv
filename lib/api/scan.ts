/**
 * Frontend API client for document scanning
 */

export interface ScanOptions {
  /** Output mode: "bw" for black & white, "color" for color */
  mode?: "bw" | "color";
  /** Block size for adaptive thresholding (default: 15) */
  blockSize?: number;
  /** Offset for adaptive thresholding (default: 10) */
  offset?: number;
  /** Output format (default: png) */
  format?: "png" | "jpeg";
  /** JPEG quality (default: 90) */
  quality?: number;
  /** Maximum output dimension (default: 2048) */
  maxSize?: number;
}

/**
 * Scan a document using the server API
 *
 * @param file - Image file to scan
 * @param options - Scan options
 * @returns Blob containing the processed image
 */
export async function scanDocumentAPI(
  file: File,
  options: ScanOptions = {}
): Promise<Blob> {
  const {
    mode = "bw",
    blockSize = 15,
    offset = 10,
    format = "png",
    quality = 90,
    maxSize = 2048,
  } = options;

  // Build query string
  const params = new URLSearchParams({
    mode,
    blockSize: blockSize.toString(),
    offset: offset.toString(),
    format,
    quality: quality.toString(),
    maxSize: maxSize.toString(),
  });

  // Create form data
  const formData = new FormData();
  formData.append("file", file);

  // Make the API request
  const response = await fetch(`/api/scan?${params.toString()}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to scan document";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Response might not be JSON
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

/**
 * Convert a Blob to a data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Download a Blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
