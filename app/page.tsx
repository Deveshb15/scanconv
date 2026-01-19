"use client";

import { ImageUploader } from "@/components/ImageUploader";
import { ScanPreview } from "@/components/ScanPreview";
import { DownloadButton } from "@/components/DownloadButton";
import { useImageProcessor } from "@/hooks/useImageProcessor";

export default function Home() {
  const {
    originalImage,
    processedImage,
    isProcessing,
    isGeneratingPdf,
    error,
    filename,
    colorMode,
    handleImageSelect,
    handleDownload,
    setColorMode,
    reset,
  } = useImageProcessor();

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Header with SEO-optimized content */}
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Free Online Document Scanner
          </h1>
          <p className="mx-auto max-w-2xl text-base text-neutral-600">
            Convert any image to a professional scanned PDF instantly. Features automatic
            edge detection, perspective correction, and B&W conversion.
            <span className="text-neutral-500"> 100% private - all processing happens in your browser.</span>
          </p>
        </header>

        {/* Error display */}
        {error && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Main Scanner Application */}
        <section aria-label="Document Scanner" className="mx-auto max-w-xl">
          <div className="space-y-8">
            {/* Image Uploader */}
            {!originalImage ? (
              <ImageUploader
                onImageSelect={handleImageSelect}
                disabled={isProcessing}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={reset}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Upload a different document image"
                >
                  Upload different image
                </button>

                {/* Color Mode Toggle */}
                <div
                  className="inline-flex rounded-lg border border-neutral-200 bg-white p-1"
                  role="group"
                  aria-label="Scan mode selection"
                >
                  <button
                    onClick={() => setColorMode("bw")}
                    disabled={isProcessing}
                    aria-pressed={colorMode === "bw"}
                    className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
                      colorMode === "bw"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:text-neutral-900"
                    } ${isProcessing ? "opacity-50" : ""}`}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => setColorMode("color")}
                    disabled={isProcessing}
                    aria-pressed={colorMode === "color"}
                    className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
                      colorMode === "color"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:text-neutral-900"
                    } ${isProcessing ? "opacity-50" : ""}`}
                  >
                    Color
                  </button>
                </div>
              </div>
            )}

            {/* Preview */}
            {originalImage && (
              <ScanPreview
                originalImage={originalImage}
                processedImage={processedImage}
                isProcessing={isProcessing}
              />
            )}

            {/* Download Button */}
            {processedImage && !isProcessing && (
              <div className="flex justify-center">
                <DownloadButton
                  onDownload={handleDownload}
                  disabled={isGeneratingPdf}
                  filename={filename || undefined}
                />
              </div>
            )}
          </div>
        </section>

        {/* Features Section - SEO Content */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="mt-20 border-t border-neutral-200 pt-16"
        >
          <h2 id="features-heading" className="mb-8 text-center text-2xl font-semibold text-neutral-900">
            Why Choose ScanConv?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-semibold text-neutral-900">Automatic Edge Detection</h3>
              <p className="text-sm text-neutral-600">
                Advanced computer vision algorithms automatically detect document edges and remove backgrounds,
                even from photos taken at angles.
              </p>
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-semibold text-neutral-900">100% Private & Secure</h3>
              <p className="text-sm text-neutral-600">
                Your documents never leave your device. All image processing happens directly in your browser -
                no uploads, no servers, complete privacy.
              </p>
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-semibold text-neutral-900">Multiple Format Support</h3>
              <p className="text-sm text-neutral-600">
                Supports JPG, PNG, HEIC (iPhone), WebP, TIFF, and more. Export as PDF with A4 or Letter sizing
                for professional documents.
              </p>
            </article>
          </div>
        </section>

        {/* How It Works - SEO Content */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="mt-16"
        >
          <h2 id="how-it-works-heading" className="mb-8 text-center text-2xl font-semibold text-neutral-900">
            How to Scan Documents Online
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="flex gap-4 rounded-xl bg-neutral-100 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900">Upload Image</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Drag and drop or click to upload your document photo. Works with camera photos or saved images.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl bg-neutral-100 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                2
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900">Auto Processing</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  ScanConv automatically detects edges, corrects perspective, and applies professional scan effects.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl bg-neutral-100 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                3
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900">Download PDF</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Preview your scanned document and download as a professional PDF ready for sharing or printing.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* FAQ Section - SEO Content */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="mt-16"
        >
          <h2 id="faq-heading" className="mb-8 text-center text-2xl font-semibold text-neutral-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer p-5 font-semibold text-neutral-900 marker:text-neutral-400">
                Is ScanConv completely free to use?
              </summary>
              <p className="px-5 pb-5 text-sm text-neutral-600">
                Yes, ScanConv is 100% free with no hidden fees, subscriptions, or premium features.
                All functionality including unlimited scans, PDF export, and all image formats are
                available to everyone at no cost.
              </p>
            </details>
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer p-5 font-semibold text-neutral-900 marker:text-neutral-400">
                Are my documents private and secure?
              </summary>
              <p className="px-5 pb-5 text-sm text-neutral-600">
                Absolutely. ScanConv processes all documents directly in your browser using client-side
                technology. Your images and documents are never uploaded to any server. All processing
                happens locally on your device, ensuring complete privacy for sensitive documents.
              </p>
            </details>
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer p-5 font-semibold text-neutral-900 marker:text-neutral-400">
                What image formats does ScanConv support?
              </summary>
              <p className="px-5 pb-5 text-sm text-neutral-600">
                ScanConv supports all major image formats including JPG/JPEG, PNG, HEIC/HEIF (iPhone photos),
                WebP, TIFF, GIF, and BMP. Files up to 20MB are supported, making it perfect for high-resolution
                camera photos.
              </p>
            </details>
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer p-5 font-semibold text-neutral-900 marker:text-neutral-400">
                Can I use ScanConv on my phone?
              </summary>
              <p className="px-5 pb-5 text-sm text-neutral-600">
                Yes! ScanConv works on any device with a modern web browser, including iPhones, Android phones,
                tablets, and computers. Simply visit the website, take a photo of your document or upload an
                existing image, and convert it to a scanned PDF instantly.
              </p>
            </details>
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer p-5 font-semibold text-neutral-900 marker:text-neutral-400">
                What&apos;s the difference between B&W and Color mode?
              </summary>
              <p className="px-5 pb-5 text-sm text-neutral-600">
                B&W (Black & White) mode applies adaptive thresholding to create crisp, high-contrast scans
                perfect for text documents, receipts, and forms. Color mode preserves the original colors
                while still applying edge detection and perspective correction, ideal for photos, certificates,
                or documents with colored graphics.
              </p>
            </details>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-neutral-200 pt-8 text-center">
          <p className="text-sm font-medium text-neutral-700">ScanConv</p>
          <p className="mt-2 text-xs text-neutral-500">
            Free online document scanner with automatic edge detection, perspective correction,
            and PDF export. No sign-up required.
          </p>
          <p className="mt-4 text-xs text-neutral-400">
            Supports JPG, PNG, HEIC, WebP, TIFF &bull; A4 & Letter PDF sizing &bull; 100% browser-based
          </p>
        </footer>
      </main>
    </div>
  );
}
