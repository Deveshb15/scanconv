/**
 * Server-side document scanning pipeline
 * Orchestrates: Load → Detect → Transform → Threshold → Output
 */

import sharp from "sharp";
import { detectDocumentCorners } from "./document-detection";
import { applyPerspectiveTransform } from "./perspective";
import { applyAdaptiveThreshold } from "./threshold";

export interface ScanOptions {
  /** Block size for adaptive thresholding (default: 15) */
  blockSize?: number;
  /** Offset for adaptive thresholding (default: 10) */
  offset?: number;
  /** Maximum output dimension (default: 2048) */
  maxOutputSize?: number;
  /** Output format (default: png) */
  format?: "png" | "jpeg";
  /** JPEG quality (default: 90) */
  quality?: number;
}

/**
 * Process a document scan from raw image buffer
 *
 * Pipeline:
 * 1. Load with Sharp and extract raw RGBA
 * 2. Detect document corners (edge detection, contour finding)
 * 3. Apply perspective transform (flatten to rectangle)
 * 4. Apply B&W adaptive threshold
 * 5. Return clean scanned document
 *
 * @param inputBuffer - Input image buffer (any format Sharp supports)
 * @param options - Processing options
 * @returns Processed image buffer (PNG)
 */
export async function processDocumentScan(
  inputBuffer: Buffer,
  options: ScanOptions = {}
): Promise<Buffer> {
  const {
    blockSize = 15,
    offset = 10,
    maxOutputSize = 2048,
    format = "png",
    quality = 90,
  } = options;

  // Step 1: Load image with Sharp and get raw RGBA data
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Failed to get image dimensions");
  }

  // Scale down if too large for processing
  let processWidth = metadata.width;
  let processHeight = metadata.height;
  const maxProcessSize = 4096; // Max size for processing to avoid memory issues

  if (processWidth > maxProcessSize || processHeight > maxProcessSize) {
    const scale = maxProcessSize / Math.max(processWidth, processHeight);
    processWidth = Math.floor(processWidth * scale);
    processHeight = Math.floor(processHeight * scale);
  }

  // Get raw RGBA buffer
  const { data: rawData, info } = await image
    .resize(processWidth, processHeight, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Step 2: Detect document corners
  const corners = detectDocumentCorners(rawData, width, height);

  if (!corners) {
    throw new Error("Failed to detect document corners");
  }

  // Step 3: Apply perspective transformation
  const transformed = applyPerspectiveTransform(rawData, width, height, corners);

  // Step 4: Apply adaptive thresholding for B&W conversion
  const thresholded = applyAdaptiveThreshold(
    transformed.data,
    transformed.width,
    transformed.height,
    { blockSize, offset }
  );

  // Step 5: Create output image with Sharp
  let outputWidth = transformed.width;
  let outputHeight = transformed.height;

  // Scale to max output size if needed
  if (outputWidth > maxOutputSize || outputHeight > maxOutputSize) {
    const scale = maxOutputSize / Math.max(outputWidth, outputHeight);
    outputWidth = Math.floor(outputWidth * scale);
    outputHeight = Math.floor(outputHeight * scale);
  }

  // Convert back to image using Sharp
  let outputImage = sharp(thresholded, {
    raw: {
      width: transformed.width,
      height: transformed.height,
      channels: 4,
    },
  });

  // Resize if needed
  if (outputWidth !== transformed.width || outputHeight !== transformed.height) {
    outputImage = outputImage.resize(outputWidth, outputHeight, {
      fit: "fill",
      kernel: "lanczos3",
    });
  }

  // Output in requested format
  if (format === "jpeg") {
    return outputImage.jpeg({ quality }).toBuffer();
  } else {
    return outputImage.png({ compressionLevel: 6 }).toBuffer();
  }
}

/**
 * Process document with color preservation (no B&W threshold)
 * Useful when you want the document flattened but keep colors
 */
export async function processDocumentColor(
  inputBuffer: Buffer,
  options: Omit<ScanOptions, "blockSize" | "offset"> = {}
): Promise<Buffer> {
  const { maxOutputSize = 2048, format = "png", quality = 90 } = options;

  // Step 1: Load image with Sharp
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Failed to get image dimensions");
  }

  // Scale down if too large for processing
  let processWidth = metadata.width;
  let processHeight = metadata.height;
  const maxProcessSize = 4096;

  if (processWidth > maxProcessSize || processHeight > maxProcessSize) {
    const scale = maxProcessSize / Math.max(processWidth, processHeight);
    processWidth = Math.floor(processWidth * scale);
    processHeight = Math.floor(processHeight * scale);
  }

  // Get raw RGBA buffer
  const { data: rawData, info } = await image
    .resize(processWidth, processHeight, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Step 2: Detect document corners
  const corners = detectDocumentCorners(rawData, width, height);

  if (!corners) {
    throw new Error("Failed to detect document corners");
  }

  // Step 3: Apply perspective transformation (no thresholding)
  const transformed = applyPerspectiveTransform(rawData, width, height, corners);

  // Step 4: Create output image
  let outputWidth = transformed.width;
  let outputHeight = transformed.height;

  if (outputWidth > maxOutputSize || outputHeight > maxOutputSize) {
    const scale = maxOutputSize / Math.max(outputWidth, outputHeight);
    outputWidth = Math.floor(outputWidth * scale);
    outputHeight = Math.floor(outputHeight * scale);
  }

  let outputImage = sharp(transformed.data, {
    raw: {
      width: transformed.width,
      height: transformed.height,
      channels: 4,
    },
  });

  if (outputWidth !== transformed.width || outputHeight !== transformed.height) {
    outputImage = outputImage.resize(outputWidth, outputHeight, {
      fit: "fill",
      kernel: "lanczos3",
    });
  }

  if (format === "jpeg") {
    return outputImage.jpeg({ quality }).toBuffer();
  } else {
    return outputImage.png({ compressionLevel: 6 }).toBuffer();
  }
}
