/**
 * Apply contrast and brightness adjustments
 */
export function applyContrast(
  canvas: HTMLCanvasElement,
  contrast: number,
  brightness: number
): HTMLCanvasElement {
  if (contrast === 0 && brightness === 0) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Standard contrast formula
  // factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast
    data[i] = clamp(contrastFactor * (data[i] - 128) + 128, 0, 255);
    data[i + 1] = clamp(contrastFactor * (data[i + 1] - 128) + 128, 0, 255);
    data[i + 2] = clamp(contrastFactor * (data[i + 2] - 128) + 128, 0, 255);

    // Apply brightness
    data[i] = clamp(data[i] + brightness, 0, 255);
    data[i + 1] = clamp(data[i + 1] + brightness, 0, 255);
    data[i + 2] = clamp(data[i + 2] + brightness, 0, 255);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
