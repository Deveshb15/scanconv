/**
 * Apply rotation/skew effect to canvas
 * Documents rarely perfectly aligned on scanner
 */
export function applyRotation(
  canvas: HTMLCanvasElement,
  angleDegrees: number
): HTMLCanvasElement {
  if (angleDegrees === 0) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const angleRad = (angleDegrees * Math.PI) / 180;

  // Calculate new dimensions to fit rotated content
  const sin = Math.abs(Math.sin(angleRad));
  const cos = Math.abs(Math.cos(angleRad));
  const newWidth = Math.ceil(canvas.width * cos + canvas.height * sin);
  const newHeight = Math.ceil(canvas.width * sin + canvas.height * cos);

  // Create new canvas with expanded dimensions
  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = newWidth;
  rotatedCanvas.height = newHeight;

  const rotatedCtx = rotatedCanvas.getContext("2d");
  if (!rotatedCtx) return canvas;

  // Fill with paper-like background
  rotatedCtx.fillStyle = "#fafafa";
  rotatedCtx.fillRect(0, 0, newWidth, newHeight);

  // Rotate around center
  rotatedCtx.translate(newWidth / 2, newHeight / 2);
  rotatedCtx.rotate(angleRad);
  rotatedCtx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw original image
  rotatedCtx.drawImage(canvas, 0, 0);

  return rotatedCanvas;
}
