/**
 * Apply noise and paper texture effects
 */
export function applyNoise(
  canvas: HTMLCanvasElement,
  intensity: number,
  addFiberTexture: boolean
): HTMLCanvasElement {
  if (intensity === 0 && !addFiberTexture) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const maxNoise = intensity * 50; // Scale intensity to pixel values

  for (let i = 0; i < data.length; i += 4) {
    // Per-pixel noise
    if (intensity > 0) {
      const noise = (Math.random() - 0.5) * 2 * maxNoise;
      data[i] = clamp(data[i] + noise, 0, 255); // R
      data[i + 1] = clamp(data[i + 1] + noise, 0, 255); // G
      data[i + 2] = clamp(data[i + 2] + noise, 0, 255); // B
    }

    // Paper fiber texture via overlapping sine waves
    if (addFiberTexture) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);

      const fiber =
        Math.sin(x * 0.1 + y * 0.05) * 0.3 +
        Math.sin(x * 0.05 + y * 0.1) * 0.3 +
        Math.sin((x + y) * 0.08) * 0.2;

      const fiberNoise = fiber * 8 * intensity;
      data[i] = clamp(data[i] + fiberNoise, 0, 255);
      data[i + 1] = clamp(data[i + 1] + fiberNoise, 0, 255);
      data[i + 2] = clamp(data[i + 2] + fiberNoise, 0, 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
