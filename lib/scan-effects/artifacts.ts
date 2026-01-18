/**
 * Apply artifacts (dust specks, scan lines)
 */
export function applyArtifacts(
  canvas: HTMLCanvasElement,
  dustCount: number,
  addScanLines: boolean,
  scanLineIntensity: number
): HTMLCanvasElement {
  if (dustCount === 0 && !addScanLines) return canvas;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Add dust specks
  if (dustCount > 0) {
    for (let i = 0; i < dustCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 1 + Math.random() * 3;
      const opacity = 0.3 + Math.random() * 0.5;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = Math.random() > 0.3 ? "#333" : "#fff"; // Dark or light specks
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Add horizontal scan lines
  if (addScanLines && scanLineIntensity > 0) {
    ctx.save();
    ctx.globalAlpha = scanLineIntensity;

    // Draw alternating light/dark horizontal lines
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.05)";
      ctx.fillRect(0, y, canvas.width, 1);
    }

    // Add occasional brighter scan lines (like scanner lamp flicker)
    const flickerCount = Math.floor(canvas.height / 200);
    for (let i = 0; i < flickerCount; i++) {
      const y = Math.floor(Math.random() * canvas.height);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
      ctx.fillRect(0, y, canvas.width, 2);
    }

    ctx.restore();
  }

  return canvas;
}
