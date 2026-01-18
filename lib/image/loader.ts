/**
 * Image loader with HEIC support (lazy loaded)
 */

let heic2anyModule: typeof import("heic2any") | null = null;

/**
 * Load image from file, supporting JPG, PNG, HEIC, etc.
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  // Check if HEIC file
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  let imageBlob: Blob = file;

  if (isHeic) {
    // Lazy load heic2any only when needed
    if (!heic2anyModule) {
      heic2anyModule = await import("heic2any");
    }

    try {
      const result = await heic2anyModule.default({
        blob: file,
        toType: "image/jpeg",
        quality: 0.95,
      });

      // heic2any can return single blob or array
      imageBlob = Array.isArray(result) ? result[0] : result;
    } catch (error) {
      throw new Error(
        `Failed to convert HEIC image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  return blobToImage(imageBlob);
}

/**
 * Convert blob to HTMLImageElement
 */
function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext;
}

/**
 * Check if file is a supported image format
 */
export function isSupportedImage(file: File): boolean {
  const supportedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/bmp",
  ];

  const supportedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp"];

  const ext = getFileExtension(file.name);

  return supportedTypes.includes(file.type) || supportedExtensions.includes(ext);
}
