import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ScanConv - Image to Scanned PDF Converter",
  description:
    "Convert any image to a PDF that looks like it was physically scanned. 100% client-side processing for privacy.",
  keywords: [
    "scan",
    "pdf",
    "convert",
    "image",
    "scanner",
    "document",
    "vintage",
    "effect",
  ],
  authors: [{ name: "ScanConv" }],
  openGraph: {
    title: "ScanConv - Image to Scanned PDF Converter",
    description: "Make any image look like it was physically scanned!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
