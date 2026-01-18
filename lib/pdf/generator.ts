import { PDFDocument } from "pdf-lib";
import { canvasToBlob } from "../scan-effects";

export type PageSize = "original" | "a4" | "letter";

interface PageDimensions {
  width: number;
  height: number;
}

const PAGE_SIZES: Record<Exclude<PageSize, "original">, PageDimensions> = {
  a4: { width: 595.28, height: 841.89 }, // 210mm x 297mm at 72dpi
  letter: { width: 612, height: 792 }, // 8.5" x 11" at 72dpi
};

/**
 * Generate PDF from processed canvas
 */
export async function generatePdf(
  canvas: HTMLCanvasElement,
  pageSize: PageSize = "original",
  quality: number = 0.92
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Get image as JPEG blob
  const imageBlob = await canvasToBlob(canvas, quality);
  const imageBytes = await blobToArrayBuffer(imageBlob);

  // Embed image in PDF
  const image = await pdfDoc.embedJpg(imageBytes);

  // Calculate page dimensions
  const imageDims = { width: image.width, height: image.height };
  const pageDims = calculatePageDimensions(imageDims, pageSize);

  // Add page
  const page = pdfDoc.addPage([pageDims.width, pageDims.height]);

  // Calculate image position (centered, fit to page with margins)
  const margin = pageSize === "original" ? 0 : 36; // 0.5 inch margins for standard sizes
  const maxWidth = pageDims.width - margin * 2;
  const maxHeight = pageDims.height - margin * 2;

  const scale = Math.min(maxWidth / imageDims.width, maxHeight / imageDims.height, 1);

  const drawWidth = imageDims.width * scale;
  const drawHeight = imageDims.height * scale;
  const x = (pageDims.width - drawWidth) / 2;
  const y = (pageDims.height - drawHeight) / 2;

  // Draw image
  page.drawImage(image, {
    x,
    y,
    width: drawWidth,
    height: drawHeight,
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Calculate page dimensions based on image and page size preference
 */
function calculatePageDimensions(
  imageDims: PageDimensions,
  pageSize: PageSize
): PageDimensions {
  if (pageSize === "original") {
    // Use image dimensions (72dpi equivalent)
    return {
      width: imageDims.width,
      height: imageDims.height,
    };
  }

  const standardSize = PAGE_SIZES[pageSize];

  // Determine orientation based on image aspect ratio
  const imageAspect = imageDims.width / imageDims.height;
  const standardAspect = standardSize.width / standardSize.height;

  // If image is landscape and standard is portrait, or vice versa, rotate
  if ((imageAspect > 1 && standardAspect < 1) || (imageAspect < 1 && standardAspect > 1)) {
    return {
      width: standardSize.height,
      height: standardSize.width,
    };
  }

  return standardSize;
}

/**
 * Convert Blob to ArrayBuffer
 */
function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read blob as ArrayBuffer"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Download PDF bytes as file
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string = "scanned-document.pdf") {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
