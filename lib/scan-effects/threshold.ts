import { ScanEffectParams } from "./types";

/**
 * Apply thresholding to convert grayscale image to pure black & white
 * Uses either global or adaptive (Bradley's) thresholding algorithm
 */
export function applyThreshold(
  canvas: HTMLCanvasElement,
  method: ScanEffectParams["thresholdMethod"],
  thresholdValue: number,
  blockSize: number,
  offset: number
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // First convert to grayscale and extract grayscale values
  const grayscale = new Float64Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luminance-preserving grayscale
    grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  if (method === "global") {
    applyGlobalThreshold(data, grayscale, thresholdValue);
  } else {
    applyAdaptiveThreshold(data, grayscale, width, height, blockSize, offset);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Global thresholding - simple comparison against fixed value
 */
function applyGlobalThreshold(
  data: Uint8ClampedArray,
  grayscale: Float64Array,
  threshold: number
): void {
  for (let i = 0; i < grayscale.length; i++) {
    const value = grayscale[i] > threshold ? 255 : 0;
    const idx = i * 4;
    data[idx] = value;
    data[idx + 1] = value;
    data[idx + 2] = value;
    // Alpha stays unchanged
  }
}

/**
 * Adaptive thresholding using Bradley's algorithm
 * Calculates local mean using integral image for O(1) local sum lookup
 */
function applyAdaptiveThreshold(
  data: Uint8ClampedArray,
  grayscale: Float64Array,
  width: number,
  height: number,
  blockSize: number,
  offset: number
): void {
  // Ensure block size is odd and at least 3
  blockSize = Math.max(3, blockSize | 1);
  const halfBlock = Math.floor(blockSize / 2);

  // Build integral image for O(1) local sum calculation
  // integral[y][x] = sum of all pixels from (0,0) to (x,y)
  const integral = buildIntegralImage(grayscale, width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate local region bounds
      const x1 = Math.max(0, x - halfBlock);
      const y1 = Math.max(0, y - halfBlock);
      const x2 = Math.min(width - 1, x + halfBlock);
      const y2 = Math.min(height - 1, y + halfBlock);

      // Calculate local sum using integral image
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const localSum = getIntegralSum(integral, width, x1, y1, x2, y2);
      const localMean = localSum / count;

      // Apply threshold with offset
      // If pixel is darker than local mean minus offset, it's black (ink)
      const pixelIdx = y * width + x;
      const pixelValue = grayscale[pixelIdx];
      const threshold = localMean * (1 - offset / 100);

      const value = pixelValue > threshold ? 255 : 0;
      const idx = pixelIdx * 4;
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
      // Alpha stays unchanged
    }
  }
}

/**
 * Build integral image (summed area table)
 * integral[i] = sum of all pixels from (0,0) to position i
 */
function buildIntegralImage(
  grayscale: Float64Array,
  width: number,
  height: number
): Float64Array {
  const integral = new Float64Array(width * height);

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      rowSum += grayscale[idx];

      if (y === 0) {
        integral[idx] = rowSum;
      } else {
        integral[idx] = rowSum + integral[(y - 1) * width + x];
      }
    }
  }

  return integral;
}

/**
 * Get sum of values in a rectangular region using integral image
 * O(1) lookup regardless of region size
 */
function getIntegralSum(
  integral: Float64Array,
  width: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  // Sum = integral[x2,y2] - integral[x1-1,y2] - integral[x2,y1-1] + integral[x1-1,y1-1]
  const a = x1 > 0 && y1 > 0 ? integral[(y1 - 1) * width + (x1 - 1)] : 0;
  const b = y1 > 0 ? integral[(y1 - 1) * width + x2] : 0;
  const c = x1 > 0 ? integral[y2 * width + (x1 - 1)] : 0;
  const d = integral[y2 * width + x2];

  return d - b - c + a;
}
