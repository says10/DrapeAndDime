"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface BannerData {
  mainBanner: string;
  mainBannerType: 'image' | 'video';
  verticalBanner1: string;
  verticalBanner1Type: 'image' | 'video';
  verticalBanner1Title: string;
  verticalBanner1Subtitle: string;
  verticalBanner1Cta: string;
  verticalBanner1CtaLink: string;
  verticalBanner2: string;
  verticalBanner2Type: 'image' | 'video';
  verticalBanner2Title: string;
  verticalBanner2Subtitle: string;
  verticalBanner2Cta: string;
  verticalBanner2CtaLink: string;
  isActive: boolean;
}

const HomeBanner = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to detect if a URL is a video based on extension
  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  const fetchBannerData = async () => {
    try {
      console.log("Fetching banner data...");
      const response = await fetch("/api/banners", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log("Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Banner data received:", data);
        // Get the first active banner
        const activeBanner = data.find((banner: BannerData) => banner.isActive);
        console.log("Active banner:", activeBanner);
        setBannerData(activeBanner || null);
      } else {
        console.error("Response not ok:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function globally for manual refresh
  useEffect(() => {
    (window as any).refreshBanner = fetchBannerData;
    return () => {
      delete (window as any).refreshBanner;
    };
  }, []);

  useEffect(() => {
    fetchBannerData();
    
    // Refresh banner data every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchBannerData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToCollections = () => {
    const collectionsSection = document.querySelector('.collections-section');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth' });
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
        {/* Main Banner */}
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 w-full h-full">
            {bannerData.mainBanner ? (
              (bannerData.mainBannerType === 'video' || isVideoFile(bannerData.mainBanner)) ? (
                <video
                  src={bannerData.mainBanner}
                  className="object-cover object-center w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={(e) => console.error("Main banner video error:", e)}
                  onLoadStart={() => console.log("Main banner video loading started")}
                  onCanPlay={() => console.log("Main banner video can play")}
                />
              ) : (
                <Image
                  src={bannerData.mainBanner}
                  alt="Main banner"
                  className="object-cover object-center"
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No banner media available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                New Collection
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Discover Your Style
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
                Explore our latest collection of trendy fashion pieces
              </p>

              <button 
                onClick={scrollToCollections}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold 
                  hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 
                  active:translate-y-0 group"
              >
                Shop Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
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