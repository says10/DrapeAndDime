"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BannerData {
  mainBanner: string;
  mainBannerTitle: string;
  mainBannerSubtitle: string;
  mainBannerCta: string;
  mainBannerCtaLink: string;
}

const HomeBanner = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await fetch("/api/banners");
      if (response.ok) {
        const data = await response.json();
        setBannerData(data);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-gray-100">
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!bannerData || !bannerData.mainBanner) {
    return null;
  }

  return (
    <section className="w-full bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-8 py-8">
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 w-full h-full">
            <video
              src={bannerData.mainBanner}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover object-center w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                New Collection
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {bannerData.mainBannerTitle}
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
                {bannerData.mainBannerSubtitle}
              </p>

              <Link 
                href={bannerData.mainBannerCtaLink}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold 
                  hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 
                  active:translate-y-0 group"
              >
                {bannerData.mainBannerCta}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full" />
        </div>
      </div>
    </section>
  );
};

export default HomeBanner; 