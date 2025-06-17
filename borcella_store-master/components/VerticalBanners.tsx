"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BannerData {
  firstVerticalBanner: string;
  firstVerticalTitle: string;
  firstVerticalSubtitle: string;
  firstVerticalCta: string;
  firstVerticalCtaLink: string;
  secondVerticalBanner: string;
  secondVerticalTitle: string;
  secondVerticalSubtitle: string;
  secondVerticalCta: string;
  secondVerticalCtaLink: string;
}

const VerticalBanners = () => {
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
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!bannerData || !bannerData.firstVerticalBanner || !bannerData.secondVerticalBanner) {
    return null; // Don't render anything if no banner data
  }

  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Vertical Banner */}
          <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl group">
            <video
              src={bannerData.firstVerticalBanner}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {bannerData.firstVerticalTitle}
              </h2>
              <p className="text-white/90 mb-6 text-sm md:text-base">
                {bannerData.firstVerticalSubtitle}
              </p>
              <Link 
                href={bannerData.firstVerticalCtaLink}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold 
                  hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 
                  active:translate-y-0 group"
              >
                {bannerData.firstVerticalCta}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Second Vertical Banner */}
          <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl group">
            <video
              src={bannerData.secondVerticalBanner}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {bannerData.secondVerticalTitle}
              </h2>
              <p className="text-white/90 mb-6 text-sm md:text-base">
                {bannerData.secondVerticalSubtitle}
              </p>
              <Link 
                href={bannerData.secondVerticalCtaLink}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold 
                  hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 
                  active:translate-y-0 group"
              >
                {bannerData.secondVerticalCta}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalBanners; 