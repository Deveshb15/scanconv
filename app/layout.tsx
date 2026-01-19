import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scanconv.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ScanConv - Free Online Document Scanner | Image to PDF Converter",
    template: "%s | ScanConv",
  },
  description:
    "Free online document scanner that converts images to professional scanned PDFs. Features automatic edge detection, perspective correction, and B&W conversion. No sign-up required, 100% private - all processing happens in your browser.",
  keywords: [
    "document scanner",
    "image to pdf",
    "pdf converter",
    "scan documents online",
    "free document scanner",
    "photo to pdf",
    "image scanner",
    "online scanner",
    "convert image to scanned pdf",
    "document digitization",
    "edge detection scanner",
    "perspective correction",
    "mobile document scanner",
    "scan to pdf free",
    "picture to pdf converter",
    "scan documents with phone",
    "document scanning app",
    "ocr scanner",
    "black and white scan",
    "color scan to pdf",
    "heic to pdf",
    "jpg to pdf",
    "png to pdf",
    "free pdf scanner",
    "browser based scanner",
    "privacy first scanner",
    "no upload scanner",
    "client side document scanner",
  ],
  authors: [{ name: "ScanConv", url: siteUrl }],
  creator: "ScanConv",
  publisher: "ScanConv",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Productivity",
  classification: "Document Scanner, PDF Converter, Productivity Tool",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ScanConv",
    title: "ScanConv - Free Online Document Scanner | Convert Images to PDF",
    description:
      "Transform any image into a professional scanned PDF in seconds. Free, private, and works entirely in your browser. No sign-up required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ScanConv - Free Online Document Scanner",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScanConv - Free Online Document Scanner",
    description:
      "Convert any image to a professional scanned PDF. Free, private, browser-based. No sign-up needed.",
    images: ["/twitter-image"],
    creator: "@scanconv",
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/icon-192", sizes: "192x192", type: "image/png" },
      { url: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScanConv",
  },
  applicationName: "ScanConv",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#171717",
    "msapplication-config": "/browserconfig.xml",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "ScanConv",
      url: siteUrl,
      description:
        "Free online document scanner that converts images to professional scanned PDFs with automatic edge detection and perspective correction.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      softwareVersion: "1.0.0",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Automatic document edge detection",
        "Perspective correction",
        "Black & white scan conversion",
        "Color scan mode",
        "PDF export with A4/Letter sizing",
        "Support for JPG, PNG, HEIC, WebP, TIFF formats",
        "100% browser-based processing",
        "No account required",
        "Privacy-first - no uploads to server",
      ],
      screenshot: `${siteUrl}/opengraph-image`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1250",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ScanConv",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512`,
        width: 512,
        height: 512,
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ScanConv",
      description: "Free Online Document Scanner - Convert Images to PDF",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is ScanConv free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ScanConv is completely free to use. There are no hidden fees, subscriptions, or premium features. All functionality is available to everyone at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "Is my document data private and secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. ScanConv processes all documents directly in your browser. Your images and documents are never uploaded to any server. All processing happens locally on your device, ensuring complete privacy.",
          },
        },
        {
          "@type": "Question",
          name: "What image formats does ScanConv support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ScanConv supports all major image formats including JPG/JPEG, PNG, HEIC/HEIF (iPhone photos), WebP, TIFF, GIF, and BMP. Files up to 20MB are supported.",
          },
        },
        {
          "@type": "Question",
          name: "Can I scan documents on my phone?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! ScanConv works on any device with a modern web browser, including smartphones and tablets. Simply visit the website, upload or take a photo of your document, and convert it to a scanned PDF.",
          },
        },
        {
          "@type": "Question",
          name: "How does the automatic edge detection work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ScanConv uses advanced computer vision algorithms including Sobel edge detection and contour analysis to automatically find the edges of your document. It then applies perspective correction to straighten the document and remove any background.",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${siteUrl}/#howto`,
      name: "How to Scan Documents Online with ScanConv",
      description:
        "Learn how to convert any image or photo into a professional scanned PDF document using ScanConv.",
      totalTime: "PT1M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0",
      },
      tool: [
        {
          "@type": "HowToTool",
          name: "Web browser",
        },
        {
          "@type": "HowToTool",
          name: "Image file or camera",
        },
      ],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your image",
          text: "Drag and drop your document image or click to select a file from your device. Supported formats include JPG, PNG, HEIC, WebP, and more.",
          url: `${siteUrl}/#step1`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Choose scan mode",
          text: "Select between Black & White mode for text documents or Color mode for photos and colored documents.",
          url: `${siteUrl}/#step2`,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Preview and download",
          text: "Review the automatically processed scan with edge detection and perspective correction applied. Click Download PDF to save your scanned document.",
          url: `${siteUrl}/#step3`,
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
