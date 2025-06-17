"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface BannerData {
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

const VerticalBanners = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      console.log("VerticalBanners: Fetching banner data...");
      const response = await fetch("/api/banners");
      console.log("VerticalBanners: Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("VerticalBanners: Banner data received:", data);
        // Get the first active banner
        const activeBanner = data.find((banner: BannerData) => banner.isActive);
        console.log("VerticalBanners: Active banner:", activeBanner);
        setBannerData(activeBanner || null);
      } else {
        console.error("VerticalBanners: Response not ok:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("VerticalBanners: Error fetching banner data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full relative">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Content Container */}
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="text-center space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!bannerData || !bannerData.verticalBanner1 || !bannerData.verticalBanner2) {
    return null;
  }

  return (
    <section className="w-full relative">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Content Container */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* First Vertical Banner */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                {bannerData.verticalBanner1Type === 'image' ? (
                  <Image
                    src={bannerData.verticalBanner1}
                    alt="First option"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <video
                    src={bannerData.verticalBanner1}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                    {bannerData.verticalBanner1Title}
                  </h3>
                  <p className="text-sm mb-4 opacity-90 line-clamp-2">
                    {bannerData.verticalBanner1Subtitle}
                  </p>
                  <Link 
                    href={bannerData.verticalBanner1CtaLink}
                    className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold 
                      hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {bannerData.verticalBanner1Cta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Text */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Which one are you?
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Select your preferred style and discover your perfect look
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 font-medium">Choose Your Style</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Second Vertical Banner */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                {bannerData.verticalBanner2Type === 'image' ? (
                  <Image
                    src={bannerData.verticalBanner2}
                    alt="Second option"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <video
                    src={bannerData.verticalBanner2}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                    {bannerData.verticalBanner2Title}
                  </h3>
                  <p className="text-sm mb-4 opacity-90 line-clamp-2">
                    {bannerData.verticalBanner2Subtitle}
                  </p>
                  <Link 
                    href={bannerData.verticalBanner2CtaLink}
                    className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold 
                      hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {bannerData.verticalBanner2Cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalBanners; 