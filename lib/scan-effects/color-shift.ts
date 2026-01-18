import { ScanEffectParams } from "./types";

/**
 * Apply color shift effects (grayscale, sepia, yellowed)
 */
export function applyColorShift(
  canvas: HTMLCanvasElement,
  colorMode: ScanEffectParams["colorMode"],
  yellowTint: number
): HTMLCanvasElement {
  if (colorMode === "color" && yellowTint === 0) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let newR = r,
      newG = g,
      newB = b;

    if (colorMode === "grayscale") {
      // Luminance-preserving grayscale
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      newR = newG = newB = gray;
    } else if (colorMode === "sepia") {
      // Sepia tone transformation
      newR = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      newG = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      newB = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    } else if (colorMode === "yellowed") {
      // Yellowed paper effect - reduce blue, boost red/green slightly
      newR = Math.min(255, r * 1.05);
      newG = Math.min(255, g * 1.02);
      newB = Math.max(0, b * 0.85);
    }

    // Apply additional yellow tint if specified
    if (yellowTint > 0) {
      newR = Math.min(255, newR + yellowTint * 20);
      newG = Math.min(255, newG + yellowTint * 15);
      newB = Math.max(0, newB - yellowTint * 25);
    }

    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
