/**
 * Server-side thresholding algorithms
 * Converts images to black & white using adaptive (Bradley's) algorithm
 * Works with raw pixel buffers
 */

export interface ThresholdOptions {
  blockSize?: number; // default 15
  offset?: number; // default 10 (percentage)
}

/**
 * Apply adaptive thresholding to convert image to pure black & white
 * Uses Bradley's algorithm with integral image for O(1) local sum lookup
 *
 * @param data - RGBA pixel buffer
 * @param width - Image width
 * @param height - Image height
 * @param options - Thresholding options
 * @returns Modified buffer with B&W pixels
 */
export function applyAdaptiveThreshold(
  data: Buffer,
  width: number,
  height: number,
  options: ThresholdOptions = {}
): Buffer {
  const { blockSize = 15, offset = 10 } = options;

  // Create output buffer
  const output = Buffer.alloc(data.length);

  // Convert to grayscale array
  const grayscale = new Float64Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Luminance-preserving grayscale
    grayscale[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Ensure block size is odd and at least 3
  const actualBlockSize = Math.max(3, blockSize | 1);
  const halfBlock = Math.floor(actualBlockSize / 2);

  // Build integral image for O(1) local sum calculation
  const integral = buildIntegralImage(grayscale, width, height);

  // Apply adaptive threshold
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
      output[idx] = value;
      output[idx + 1] = value;
      output[idx + 2] = value;
      output[idx + 3] = 255; // Full opacity
    }
  }

  return output;
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

/**
 * Apply global thresholding (simple fixed threshold)
 *
 * @param data - RGBA pixel buffer
 * @param width - Image width
 * @param height - Image height
 * @param threshold - Threshold value (0-255)
 * @returns Modified buffer with B&W pixels
 */
export function applyGlobalThreshold(
  data: Buffer,
  width: number,
  height: number,
  threshold: number = 128
): Buffer {
  const output = Buffer.alloc(data.length);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Luminance-preserving grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const value = gray > threshold ? 255 : 0;

    output[idx] = value;
    output[idx + 1] = value;
    output[idx + 2] = value;
    output[idx + 3] = 255;
  }

  return output;
}
