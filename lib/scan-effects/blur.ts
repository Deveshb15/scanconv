/**
 * Apply slight blur effect to simulate scanner lens imperfections
 */
export function applyBlur(
  canvas: HTMLCanvasElement,
  radius: number
): HTMLCanvasElement {
  if (radius === 0) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Use CSS filter for blur (hardware accelerated)
  // Create temp canvas for the blur operation
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return canvas;

  // Apply blur filter
  tempCtx.filter = `blur(${radius}px)`;
  tempCtx.drawImage(canvas, 0, 0);

  // Copy back to original canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  return canvas;
}
