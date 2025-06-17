"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface BannerData {
  firstVerticalBanner: string;
  firstVerticalType: 'image' | 'video';
  firstVerticalTitle: string;
  firstVerticalSubtitle: string;
  firstVerticalCta: string;
  firstVerticalCtaLink: string;
  secondVerticalBanner: string;
  secondVerticalType: 'image' | 'video';
  secondVerticalTitle: string;
  secondVerticalSubtitle: string;
  secondVerticalCta: string;
  secondVerticalCtaLink: string;
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
      const response = await fetch("/api/banners");
      if (response.ok) {
        const data = await response.json();
        // Get the first active banner
        const activeBanner = data.find((banner: BannerData) => banner.isActive);
        setBannerData(activeBanner || null);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-16">
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
      </section>
    );
  }

  if (!bannerData || !bannerData.firstVerticalBanner || !bannerData.secondVerticalBanner) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* First Vertical Banner */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105">
              {bannerData.firstVerticalType === 'image' ? (
                <Image
                  src={bannerData.firstVerticalBanner}
                  alt="First option"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <video
                  src={bannerData.firstVerticalBanner}
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
                  {bannerData.firstVerticalTitle}
                </h3>
                <p className="text-sm mb-4 opacity-90 line-clamp-2">
                  {bannerData.firstVerticalSubtitle}
                </p>
                <Link 
                  href={bannerData.firstVerticalCtaLink}
                  className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold 
                    hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  {bannerData.firstVerticalCta}
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
              {bannerData.secondVerticalType === 'image' ? (
                <Image
                  src={bannerData.secondVerticalBanner}
                  alt="Second option"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <video
                  src={bannerData.secondVerticalBanner}
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
                  {bannerData.secondVerticalTitle}
                </h3>
                <p className="text-sm mb-4 opacity-90 line-clamp-2">
                  {bannerData.secondVerticalSubtitle}
                </p>
                <Link 
                  href={bannerData.secondVerticalCtaLink}
                  className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold 
                    hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  {bannerData.secondVerticalCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalBanners; 