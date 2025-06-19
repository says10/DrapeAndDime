import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HydrationSafe from "@/components/HydrationSafe";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DrapeAndDime ",
  description: "Fashion Ecommerce Store",
  icons: "/logo.ico",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <body className={inter.className}>
      <HydrationSafe fallback={
        <div className="min-h-screen bg-white">
          <div className="fixed top-0 left-0 w-full z-1000 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 max-w-md mx-4">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex gap-3">
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="pt-16">
            <div className="min-h-screen bg-gray-50 animate-pulse"></div>
          </div>
        </div>
      }>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </HydrationSafe>
      <Toaster />
    </body>
  );
}
