/**
 * Apply vignette effect (edge darkening from scanner light falloff)
 */
export function applyVignette(
  canvas: HTMLCanvasElement,
  intensity: number,
  radius: number
): HTMLCanvasElement {
  if (intensity === 0) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  // Create radial gradient
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * radius, // Inner radius (transparent)
    centerX,
    centerY,
    maxRadius // Outer radius (dark)
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

  // Apply vignette with multiply blend
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  return canvas;
}
