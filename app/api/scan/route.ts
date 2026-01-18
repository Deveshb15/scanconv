/**
 * Document Scanning API Route
 *
 * POST /api/scan
 * - Input: multipart/form-data with image file
 * - Output: PNG image (processed scan)
 *
 * Query parameters:
 * - mode: "bw" (default) | "color" - Output mode
 * - blockSize: number (default 15) - Adaptive threshold block size
 * - offset: number (default 10) - Adaptive threshold offset
 * - format: "png" (default) | "jpeg" - Output format
 * - quality: number (default 90) - JPEG quality
 */

import { NextRequest, NextResponse } from "next/server";
import { processDocumentScan, processDocumentColor } from "@/lib/server/pipeline";

// Configure for Node.js runtime (required for Sharp)
export const runtime = "nodejs";
export const maxDuration = 30;

// Maximum file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/tiff",
];

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, HEIC, TIFF`,
        },
        { status: 400 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") || "bw";
    const blockSize = parseInt(url.searchParams.get("blockSize") || "15", 10);
    const offset = parseInt(url.searchParams.get("offset") || "10", 10);
    const format = (url.searchParams.get("format") || "png") as "png" | "jpeg";
    const quality = parseInt(url.searchParams.get("quality") || "90", 10);
    const maxOutputSize = parseInt(
      url.searchParams.get("maxSize") || "2048",
      10
    );

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Process the document
    let outputBuffer: Buffer;

    if (mode === "color") {
      outputBuffer = await processDocumentColor(inputBuffer, {
        maxOutputSize,
        format,
        quality,
      });
    } else {
      outputBuffer = await processDocumentScan(inputBuffer, {
        blockSize,
        offset,
        maxOutputSize,
        format,
        quality,
      });
    }

    // Return the processed image
    const contentType = format === "jpeg" ? "image/jpeg" : "image/png";

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const responseData = new Uint8Array(outputBuffer);

    return new NextResponse(responseData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Document scan error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Failed to process document: ${message}` },
      { status: 500 }
    );
  }
}

// Return API info on GET
export async function GET() {
  return NextResponse.json({
    name: "Document Scanning API",
    version: "1.0.0",
    endpoints: {
      "POST /api/scan": {
        description: "Scan and process a document image",
        input: "multipart/form-data with 'file' field",
        output: "PNG or JPEG image",
        parameters: {
          mode: "bw (default) | color - Output mode",
          blockSize: "number (default 15) - Adaptive threshold block size",
          offset: "number (default 10) - Adaptive threshold offset",
          format: "png (default) | jpeg - Output format",
          quality: "number (default 90) - JPEG quality",
          maxSize: "number (default 2048) - Max output dimension",
        },
        maxFileSize: "20MB",
        supportedFormats: ALLOWED_TYPES,
      },
    },
  });
}
