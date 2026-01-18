import { ScanEffectParams } from "./types";
import { applyRotation } from "./rotation";
import { applyColorShift } from "./color-shift";
import { applyThreshold } from "./threshold";
import { applyContrast } from "./contrast";
import { applyBlur } from "./blur";
import { applyNoise } from "./noise";
import { applyVignette } from "./vignette";
import { applyArtifacts } from "./artifacts";

export * from "./types";

// Max dimensions for processing
const MAX_PREVIEW_SIZE = 1024;
const MAX_OUTPUT_SIZE = 4096;

/**
 * Main effect processing pipeline
 * Order matters! Geometric → Color → Texture → Overlay
 */
export async function processImage(
  sourceImage: HTMLImageElement,
  params: ScanEffectParams,
  forPreview: boolean = false
): Promise<HTMLCanvasElement> {
  const maxSize = forPreview ? MAX_PREVIEW_SIZE : MAX_OUTPUT_SIZE;

  // Create initial canvas from image
  let canvas = imageToCanvas(sourceImage, maxSize);

  // 1. Rotation/Skew (geometric first)
  canvas = applyRotation(canvas, params.rotationAngle);

  // 2. B&W Thresholding OR Color Shift
  if (params.colorMode === "bw") {
    // B&W mode: apply thresholding (includes grayscale conversion + binarization)
    canvas = applyThreshold(
      canvas,
      params.thresholdMethod,
      params.thresholdValue,
      params.adaptiveBlockSize,
      params.adaptiveOffset
    );
  } else {
    // Other modes: apply color shift (grayscale, sepia, yellowed, color)
    canvas = applyColorShift(canvas, params.colorMode, params.yellowTint);
  }

  // 3. Contrast/Brightness
  canvas = applyContrast(canvas, params.contrast, params.brightness);

  // 4. Blur (before noise so noise stays sharp)
  canvas = applyBlur(canvas, params.blurRadius);

  // 5. Noise/Paper Texture
  canvas = applyNoise(canvas, params.noiseIntensity, params.fiberTexture);

  // 6. Vignette (multiplicative overlay)
  canvas = applyVignette(canvas, params.vignetteIntensity, params.vignetteRadius);

  // 7. Artifacts (dust, scan lines - final layer)
  canvas = applyArtifacts(
    canvas,
    params.dustSpecks,
    params.scanLines,
    params.scanLineIntensity
  );

  return canvas;
}

/**
 * Convert image to canvas with max size constraint
 */
function imageToCanvas(image: HTMLImageElement, maxSize: number): HTMLCanvasElement {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  // Scale down if exceeds max size
  if (width > maxSize || height > maxSize) {
    const scale = maxSize / Math.max(width, height);
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(image, 0, 0, width, height);
  }

  return canvas;
}

/**
 * Get canvas as JPEG data URL
 */
export function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number = 0.92): string {
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Get canvas as Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, quality: number = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      },
      "image/jpeg",
      quality
    );
  });
}
