import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Borcella - The New Era of Shopping",
  description: "Discover the latest trends in fashion and enjoy a seamless shopping experience with Borcella. Your one-stop shop for stylish and high-quality products.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Borcella - The New Era of Shopping",
    description: "Discover the latest trends in fashion and enjoy a seamless shopping experience with Borcella. Your one-stop shop for stylish and high-quality products.",
    type: "website",
    url: "https://drapeanddime.shop",
    siteName: "Borcella",
    images: [
      {
        url: "https://drapeanddime.shop/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Borcella - The New Era of Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Borcella - The New Era of Shopping",
    description: "Discover the latest trends in fashion and enjoy a seamless shopping experience with Borcella. Your one-stop shop for stylish and high-quality products.",
    images: ["https://drapeanddime.shop/og-image.jpg"],
  },
  alternates: {
    canonical: "https://drapeanddime.shop",
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ToasterProvider />
          <Navbar />
          {children}
          <Analytics />
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
} 