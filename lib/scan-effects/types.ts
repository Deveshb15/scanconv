export interface ScanEffectParams {
  // Document Detection
  detectDocument: boolean; // auto-detect and crop document from photo

  // Rotation
  rotationAngle: number; // degrees, typically 0.5-2

  // Noise/Texture
  noiseIntensity: number; // 0-1
  fiberTexture: boolean;

  // Contrast/Brightness
  contrast: number; // -100 to 100
  brightness: number; // -100 to 100

  // Blur
  blurRadius: number; // pixels, typically 0.3-0.8

  // Color
  colorMode: "color" | "grayscale" | "bw" | "sepia" | "yellowed";
  yellowTint: number; // 0-1

  // Threshold (for B&W mode)
  thresholdMethod: "global" | "adaptive";
  thresholdValue: number; // 0-255, for global threshold (default 128)
  adaptiveBlockSize: number; // block size for adaptive threshold (default 15)
  adaptiveOffset: number; // offset for adaptive threshold (default 10)

  // Vignette
  vignetteIntensity: number; // 0-1
  vignetteRadius: number; // 0-1

  // Artifacts
  dustSpecks: number; // count
  scanLines: boolean;
  scanLineIntensity: number; // 0-1
}

export interface Preset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  params: ScanEffectParams;
}

export const defaultParams: ScanEffectParams = {
  detectDocument: true,
  rotationAngle: 0,
  noiseIntensity: 0,
  fiberTexture: false,
  contrast: 0,
  brightness: 0,
  blurRadius: 0,
  colorMode: "color",
  yellowTint: 0,
  thresholdMethod: "adaptive",
  thresholdValue: 128,
  adaptiveBlockSize: 15,
  adaptiveOffset: 10,
  vignetteIntensity: 0,
  vignetteRadius: 0.8,
  dustSpecks: 0,
  scanLines: false,
  scanLineIntensity: 0,
};

export const presets: Preset[] = [
  {
    id: "clean",
    name: "Clean",
    emoji: "✨",
    description: "Minimal effects, clean scan look",
    params: {
      detectDocument: false,
      rotationAngle: 0.3,
      noiseIntensity: 0.05,
      fiberTexture: false,
      contrast: 5,
      brightness: 2,
      blurRadius: 0.3,
      colorMode: "color",
      yellowTint: 0,
      thresholdMethod: "adaptive",
      thresholdValue: 128,
      adaptiveBlockSize: 15,
      adaptiveOffset: 10,
      vignetteIntensity: 0.1,
      vignetteRadius: 0.9,
      dustSpecks: 0,
      scanLines: false,
      scanLineIntensity: 0,
    },
  },
  {
    id: "office",
    name: "Office",
    emoji: "🏢",
    description: "Black & white with adaptive thresholding, typical office scanner",
    params: {
      detectDocument: false,
      rotationAngle: 0.5,
      noiseIntensity: 0.02,
      fiberTexture: false,
      contrast: 0,
      brightness: 0,
      blurRadius: 0.3,
      colorMode: "bw",
      yellowTint: 0,
      thresholdMethod: "adaptive",
      thresholdValue: 128,
      adaptiveBlockSize: 15,
      adaptiveOffset: 10,
      vignetteIntensity: 0.05,
      vignetteRadius: 0.95,
      dustSpecks: 2,
      scanLines: false,
      scanLineIntensity: 0,
    },
  },
  {
    id: "document",
    name: "Document",
    emoji: "📄",
    description: "Clean B&W scan optimized for text documents",
    params: {
      detectDocument: false,
      rotationAngle: 0.2,
      noiseIntensity: 0.01,
      fiberTexture: false,
      contrast: 0,
      brightness: 0,
      blurRadius: 0,
      colorMode: "bw",
      yellowTint: 0,
      thresholdMethod: "adaptive",
      thresholdValue: 128,
      adaptiveBlockSize: 11,
      adaptiveOffset: 8,
      vignetteIntensity: 0,
      vignetteRadius: 1,
      dustSpecks: 0,
      scanLines: false,
      scanLineIntensity: 0,
    },
  },
  {
    id: "vintage",
    name: "Vintage",
    emoji: "📜",
    description: "Sepia tones, more noise, slight yellowing",
    params: {
      detectDocument: false,
      rotationAngle: 1.2,
      noiseIntensity: 0.2,
      fiberTexture: true,
      contrast: 10,
      brightness: -5,
      blurRadius: 0.6,
      colorMode: "sepia",
      yellowTint: 0.3,
      thresholdMethod: "adaptive",
      thresholdValue: 128,
      adaptiveBlockSize: 15,
      adaptiveOffset: 10,
      vignetteIntensity: 0.35,
      vignetteRadius: 0.75,
      dustSpecks: 8,
      scanLines: true,
      scanLineIntensity: 0.15,
    },
  },
  {
    id: "damaged",
    name: "Damaged",
    emoji: "💀",
    description: "Heavy noise, scan lines, dust specks, rotation",
    params: {
      detectDocument: false,
      rotationAngle: 2,
      noiseIntensity: 0.35,
      fiberTexture: true,
      contrast: 20,
      brightness: -10,
      blurRadius: 0.8,
      colorMode: "yellowed",
      yellowTint: 0.5,
      thresholdMethod: "adaptive",
      thresholdValue: 128,
      adaptiveBlockSize: 15,
      adaptiveOffset: 10,
      vignetteIntensity: 0.5,
      vignetteRadius: 0.65,
      dustSpecks: 20,
      scanLines: true,
      scanLineIntensity: 0.3,
    },
  },
];
