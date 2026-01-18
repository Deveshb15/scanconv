/**
 * Perspective transformation to flatten a quadrilateral to a rectangle
 * Uses homography matrix computation and bilinear interpolation
 */

import { DocumentCorners, Point } from "./document-detection";

/**
 * Apply perspective transformation to extract and flatten a document
 * Takes source corners and produces a rectangular output
 */
export function applyPerspectiveTransform(
  sourceCanvas: HTMLCanvasElement,
  corners: DocumentCorners
): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext("2d");
  if (!ctx) return sourceCanvas;

  // Calculate output dimensions based on the source quadrilateral
  const { width: outputWidth, height: outputHeight } = calculateOutputDimensions(corners);

  // Create output canvas
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputCtx = outputCanvas.getContext("2d");
  if (!outputCtx) return sourceCanvas;

  // Get source image data
  const sourceImageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const sourceData = sourceImageData.data;
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;

  // Create output image data
  const outputImageData = outputCtx.createImageData(outputWidth, outputHeight);
  const outputData = outputImageData.data;

  // Define destination corners (rectangle)
  const destCorners: DocumentCorners = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: outputWidth - 1, y: 0 },
    bottomRight: { x: outputWidth - 1, y: outputHeight - 1 },
    bottomLeft: { x: 0, y: outputHeight - 1 },
  };

  // Compute inverse homography matrix (dest -> source)
  const H = computeHomography(destCorners, corners);

  if (!H) {
    // Fallback: just return the original canvas
    return sourceCanvas;
  }

  // Apply transformation using bilinear interpolation
  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      // Apply homography to get source coordinates
      const srcPoint = applyHomography(H, x, y);

      // Bilinear interpolation
      const pixel = bilinearInterpolate(
        sourceData,
        sourceWidth,
        sourceHeight,
        srcPoint.x,
        srcPoint.y
      );

      const outputIdx = (y * outputWidth + x) * 4;
      outputData[outputIdx] = pixel.r;
      outputData[outputIdx + 1] = pixel.g;
      outputData[outputIdx + 2] = pixel.b;
      outputData[outputIdx + 3] = pixel.a;
    }
  }

  outputCtx.putImageData(outputImageData, 0, 0);
  return outputCanvas;
}

/**
 * Calculate output dimensions based on the source quadrilateral
 */
function calculateOutputDimensions(corners: DocumentCorners): { width: number; height: number } {
  // Calculate the width as the average of top and bottom edges
  const topWidth = distance(corners.topLeft, corners.topRight);
  const bottomWidth = distance(corners.bottomLeft, corners.bottomRight);
  const width = Math.round((topWidth + bottomWidth) / 2);

  // Calculate the height as the average of left and right edges
  const leftHeight = distance(corners.topLeft, corners.bottomLeft);
  const rightHeight = distance(corners.topRight, corners.bottomRight);
  const height = Math.round((leftHeight + rightHeight) / 2);

  // Ensure minimum dimensions
  return {
    width: Math.max(100, width),
    height: Math.max(100, height),
  };
}

/**
 * Calculate distance between two points
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Compute homography matrix using Direct Linear Transform (DLT)
 * Maps 4 source points to 4 destination points
 */
function computeHomography(
  src: DocumentCorners,
  dst: DocumentCorners
): number[] | null {
  // Source and destination points
  const srcPoints = [src.topLeft, src.topRight, src.bottomRight, src.bottomLeft];
  const dstPoints = [dst.topLeft, dst.topRight, dst.bottomRight, dst.bottomLeft];

  // Build matrix A for DLT
  // Each point correspondence gives 2 equations
  const A: number[][] = [];

  for (let i = 0; i < 4; i++) {
    const { x: sx, y: sy } = srcPoints[i];
    const { x: dx, y: dy } = dstPoints[i];

    A.push([
      -sx, -sy, -1, 0, 0, 0, dx * sx, dx * sy, dx,
    ]);
    A.push([
      0, 0, 0, -sx, -sy, -1, dy * sx, dy * sy, dy,
    ]);
  }

  // Solve using SVD (simplified - use pseudo-inverse approach)
  const h = solveHomography(A);

  if (!h) return null;

  return h;
}

/**
 * Solve the homography matrix from the system of equations
 * Using a simplified approach suitable for 4-point correspondences
 */
function solveHomography(A: number[][]): number[] | null {
  // For a 4-point correspondence, we have 8 equations and 9 unknowns
  // We set h[8] = 1 and solve the remaining 8

  // Extract the 8x8 matrix and 8x1 vector
  const M: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 8; i++) {
    M.push(A[i].slice(0, 8));
    b.push(-A[i][8]);
  }

  // Solve using Gaussian elimination
  const solution = gaussianElimination(M, b);

  if (!solution) return null;

  // Append h[8] = 1
  return [...solution, 1];
}

/**
 * Gaussian elimination with partial pivoting
 */
function gaussianElimination(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
        maxRow = row;
      }
    }

    // Swap rows
    [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

    // Check for singularity
    if (Math.abs(augmented[col][col]) < 1e-10) {
      return null;
    }

    // Eliminate column
    for (let row = col + 1; row < n; row++) {
      const factor = augmented[row][col] / augmented[col][col];
      for (let j = col; j <= n; j++) {
        augmented[row][j] -= factor * augmented[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= augmented[i][j] * x[j];
    }
    x[i] = sum / augmented[i][i];
  }

  return x;
}

/**
 * Apply homography transformation to a point
 */
function applyHomography(H: number[], x: number, y: number): Point {
  const w = H[6] * x + H[7] * y + H[8];
  return {
    x: (H[0] * x + H[1] * y + H[2]) / w,
    y: (H[3] * x + H[4] * y + H[5]) / w,
  };
}

/**
 * Bilinear interpolation for smooth pixel sampling
 */
function bilinearInterpolate(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): { r: number; g: number; b: number; a: number } {
  // Clamp coordinates
  x = Math.max(0, Math.min(width - 1, x));
  y = Math.max(0, Math.min(height - 1, y));

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, width - 1);
  const y1 = Math.min(y0 + 1, height - 1);

  const xFrac = x - x0;
  const yFrac = y - y0;

  // Get the four surrounding pixels
  const idx00 = (y0 * width + x0) * 4;
  const idx01 = (y0 * width + x1) * 4;
  const idx10 = (y1 * width + x0) * 4;
  const idx11 = (y1 * width + x1) * 4;

  // Interpolate each channel
  const r = bilinear(
    data[idx00], data[idx01], data[idx10], data[idx11],
    xFrac, yFrac
  );
  const g = bilinear(
    data[idx00 + 1], data[idx01 + 1], data[idx10 + 1], data[idx11 + 1],
    xFrac, yFrac
  );
  const b = bilinear(
    data[idx00 + 2], data[idx01 + 2], data[idx10 + 2], data[idx11 + 2],
    xFrac, yFrac
  );
  const a = bilinear(
    data[idx00 + 3], data[idx01 + 3], data[idx10 + 3], data[idx11 + 3],
    xFrac, yFrac
  );

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: Math.round(a),
  };
}

/**
 * Bilinear interpolation formula
 */
function bilinear(
  v00: number, v01: number, v10: number, v11: number,
  xFrac: number, yFrac: number
): number {
  const top = v00 * (1 - xFrac) + v01 * xFrac;
  const bottom = v10 * (1 - xFrac) + v11 * xFrac;
  return top * (1 - yFrac) + bottom * yFrac;
}
