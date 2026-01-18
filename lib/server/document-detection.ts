/**
 * Server-side document detection using edge detection and contour finding
 * Works with raw pixel buffers instead of HTML Canvas
 */

export interface Point {
  x: number;
  y: number;
}

export interface DocumentCorners {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

/**
 * Detect document corners in raw RGBA pixel data
 * Returns the four corners of the detected document
 */
export function detectDocumentCorners(
  data: Buffer,
  width: number,
  height: number
): DocumentCorners | null {
  // Step 1: Convert to grayscale
  const grayscale = toGrayscale(data, width, height);

  // Step 2: Apply Gaussian blur to reduce noise
  const blurred = gaussianBlur(grayscale, width, height, 2);

  // Step 3: Edge detection using Sobel operator
  const edges = sobelEdgeDetection(blurred, width, height);

  // Step 4: Find contours and the largest quadrilateral
  const corners = findDocumentQuadrilateral(edges, width, height);

  return corners;
}

/**
 * Convert RGBA buffer to grayscale array
 */
function toGrayscale(
  data: Buffer,
  width: number,
  height: number
): Float32Array {
  const grayscale = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return grayscale;
}

/**
 * Apply Gaussian blur
 */
function gaussianBlur(
  input: Float32Array,
  width: number,
  height: number,
  sigma: number
): Float32Array {
  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  const kernel = createGaussianKernel(kernelSize, sigma);
  const output = new Float32Array(width * height);

  // Horizontal pass
  const temp = new Float32Array(width * height);
  const halfKernel = Math.floor(kernelSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weightSum = 0;
      for (let k = -halfKernel; k <= halfKernel; k++) {
        const xx = Math.min(Math.max(x + k, 0), width - 1);
        const weight = kernel[k + halfKernel];
        sum += input[y * width + xx] * weight;
        weightSum += weight;
      }
      temp[y * width + x] = sum / weightSum;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weightSum = 0;
      for (let k = -halfKernel; k <= halfKernel; k++) {
        const yy = Math.min(Math.max(y + k, 0), height - 1);
        const weight = kernel[k + halfKernel];
        sum += temp[yy * width + x] * weight;
        weightSum += weight;
      }
      output[y * width + x] = sum / weightSum;
    }
  }

  return output;
}

/**
 * Create Gaussian kernel
 */
function createGaussianKernel(size: number, sigma: number): Float32Array {
  const kernel = new Float32Array(size);
  const half = Math.floor(size / 2);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - half;
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
    sum += kernel[i];
  }

  // Normalize
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

/**
 * Sobel edge detection
 */
function sobelEdgeDetection(
  input: Float32Array,
  width: number,
  height: number
): Float32Array {
  const output = new Float32Array(width * height);

  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = input[(y + ky) * width + (x + kx)];
          const ki = (ky + 1) * 3 + (kx + 1);
          gx += pixel * sobelX[ki];
          gy += pixel * sobelY[ki];
        }
      }

      output[y * width + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return output;
}

/**
 * Find the largest quadrilateral (document) in the edge image
 */
function findDocumentQuadrilateral(
  edges: Float32Array,
  width: number,
  height: number
): DocumentCorners | null {
  // Threshold edges using Otsu's method
  const threshold = calculateOtsuThreshold(edges);
  const binary = new Uint8Array(width * height);
  for (let i = 0; i < edges.length; i++) {
    binary[i] = edges[i] > threshold ? 255 : 0;
  }

  // Find contour points using border following
  const contourPoints = findContourPoints(binary, width, height);

  if (contourPoints.length < 4) {
    // Fall back to default corners (full image with margin)
    return getDefaultCorners(width, height);
  }

  // Find convex hull
  const hull = convexHull(contourPoints);

  if (hull.length < 4) {
    return getDefaultCorners(width, height);
  }

  // Simplify to 4 corners using Douglas-Peucker algorithm
  const simplified = douglasPeucker(hull, width * 0.02);

  if (simplified.length < 4) {
    return getDefaultCorners(width, height);
  }

  // Find the 4 corners that form the largest quadrilateral
  const corners = findBestQuadrilateral(simplified, width, height);

  if (!corners) {
    return getDefaultCorners(width, height);
  }

  return orderCorners(corners);
}

/**
 * Otsu's method for automatic thresholding
 */
function calculateOtsuThreshold(data: Float32Array): number {
  const histogram = new Array(256).fill(0);
  let max = 0;

  for (let i = 0; i < data.length; i++) {
    const val = Math.min(255, Math.max(0, Math.floor(data[i])));
    histogram[val]++;
    if (data[i] > max) max = data[i];
  }

  const total = data.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

/**
 * Find edge contour points
 */
function findContourPoints(
  binary: Uint8Array,
  width: number,
  height: number
): Point[] {
  const points: Point[] = [];
  const margin = Math.floor(Math.min(width, height) * 0.02);

  // Scan for edge pixels
  for (let y = margin; y < height - margin; y += 2) {
    for (let x = margin; x < width - margin; x += 2) {
      if (binary[y * width + x] === 255) {
        // Check if it's an edge point (has non-edge neighbor)
        let isEdge = false;
        for (let dy = -1; dy <= 1 && !isEdge; dy++) {
          for (let dx = -1; dx <= 1 && !isEdge; dx++) {
            if (binary[(y + dy) * width + (x + dx)] === 0) {
              isEdge = true;
            }
          }
        }
        if (isEdge) {
          points.push({ x, y });
        }
      }
    }
  }

  return points;
}

/**
 * Convex hull using Graham scan
 */
function convexHull(points: Point[]): Point[] {
  if (points.length < 3) return points;

  // Find the bottom-most point
  let minY = points[0].y;
  let minIdx = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < minY || (points[i].y === minY && points[i].x < points[minIdx].x)) {
      minY = points[i].y;
      minIdx = i;
    }
  }

  // Swap with first point
  [points[0], points[minIdx]] = [points[minIdx], points[0]];
  const pivot = points[0];

  // Sort by polar angle
  const sorted = points.slice(1).sort((a, b) => {
    const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
    const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
    return angleA - angleB;
  });

  const stack: Point[] = [pivot];

  for (const point of sorted) {
    while (stack.length > 1 && crossProduct(stack[stack.length - 2], stack[stack.length - 1], point) <= 0) {
      stack.pop();
    }
    stack.push(point);
  }

  return stack;
}

/**
 * Cross product of vectors OA and OB
 */
function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Douglas-Peucker line simplification
 */
function douglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points;

  // Find the point with max distance from line between first and last
  let maxDist = 0;
  let maxIdx = 0;

  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

/**
 * Perpendicular distance from point to line
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  if (d === 0) return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);

  return Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / d;
}

/**
 * Find the 4 points that form the best quadrilateral
 */
function findBestQuadrilateral(points: Point[], width: number, height: number): Point[] | null {
  if (points.length < 4) return null;

  if (points.length === 4) return points;

  // Find 4 corners closest to the image corners
  const imageCorners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  const selected: Point[] = [];

  for (const corner of imageCorners) {
    let minDist = Infinity;
    let closest: Point | null = null;

    for (const point of points) {
      // Skip if already selected
      if (selected.some(s => s.x === point.x && s.y === point.y)) continue;

      const dist = Math.sqrt((point.x - corner.x) ** 2 + (point.y - corner.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = point;
      }
    }

    if (closest) {
      selected.push(closest);
    }
  }

  return selected.length === 4 ? selected : null;
}

/**
 * Order corners as: topLeft, topRight, bottomRight, bottomLeft
 */
function orderCorners(points: Point[]): DocumentCorners {
  // Sort by y to get top and bottom pairs
  const sorted = [...points].sort((a, b) => a.y - b.y);
  const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
  const bottom = sorted.slice(2).sort((a, b) => a.x - b.x);

  return {
    topLeft: top[0],
    topRight: top[1],
    bottomLeft: bottom[0],
    bottomRight: bottom[1],
  };
}

/**
 * Default corners with small margin
 */
function getDefaultCorners(width: number, height: number): DocumentCorners {
  const margin = Math.floor(Math.min(width, height) * 0.05);
  return {
    topLeft: { x: margin, y: margin },
    topRight: { x: width - margin, y: margin },
    bottomRight: { x: width - margin, y: height - margin },
    bottomLeft: { x: margin, y: height - margin },
  };
}
