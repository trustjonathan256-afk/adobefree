import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adobe Free Download - Get All Adobe Apps for Free",
  description: "Download Adobe Photoshop, Illustrator, Premiere Pro, After Effects and more for free. Direct download links for all Adobe Creative Cloud apps safe and secure.",
  keywords: [
    "adobe free",
    "adobe",
    "adobe free download",
    "download adobe free",
    "adobe download",
    "photoshop free",
    "illustrator free",
    "premiere pro free",
    "creative cloud free",
  ],
  authors: [{ name: "Adobe Free" }],
  creator: "Adobe Free",
  publisher: "Adobe Free",
  openGraph: {
    title: "Adobe Free Download - Get All Adobe Apps for Free",
    description: "Download all Adobe Creative Cloud apps for free. Photoshop, Illustrator, Premiere Pro, and more.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://adobefree.com",
    siteName: "Adobe Free",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://adobefree.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adobe Free Download - Get All Adobe Apps for Free",
    description: "Download all Adobe Creative Cloud apps for free. Photoshop, Illustrator, Premiere Pro, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Adobe Creative Cloud Free",
    applicationCategory: "DesignApplication",
    operatingSystem: "Windows, macOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            className: "glass-toast",
            style: {
              borderRadius: "9999rem",
              color: "#ffffff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
