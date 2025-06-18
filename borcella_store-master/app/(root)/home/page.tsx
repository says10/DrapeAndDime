"use client";

// app/home/page.tsx

import Image from "next/image";
import CollectionCarousel from "@/components/CollectionCarousel";
import ProductList from "@/components/ProductList";
import VerticalBanners from "@/components/VerticalBanners";
import { getCollections } from "@/lib/actions/actions";
import HomeBanner from "@/components/HomeBanner";
import { useEffect, useState } from "react";

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Fetch collections
    const fetchCollections = async () => {
      const data = await getCollections();
      setCollections(data);
    };
    fetchCollections();

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Banner with 16:9 Aspect Ratio */}
      <HomeBanner />

      {/* Collections Carousel */}
      <div 
        className={`transition-all duration-700 ease-out ${
          scrollY > 200 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
        }`}
        style={{
          transform: scrollY > 200 ? 'translateY(0) scale(1.02)' : 'translateY(8px) scale(1)',
          boxShadow: scrollY > 200 ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
        }}
      >
        <CollectionCarousel collections={collections} />
      </div>

      {/* Vertical Banners (9:16) */}
      <div 
        className={`transition-all duration-700 ease-out ${
          scrollY > 400 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
        }`}
        style={{
          transform: scrollY > 400 ? 'translateY(0) scale(1.02)' : 'translateY(8px) scale(1)',
          boxShadow: scrollY > 400 ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
        }}
      >
        <VerticalBanners />
      </div>

      {/* Products Section with Premium Background */}
      <div 
        className="w-full relative transition-all duration-700 ease-out"
        style={{
          transform: scrollY > 600 ? 'translateY(0) scale(1.02)' : 'translateY(8px) scale(1)',
          boxShadow: scrollY > 600 ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
        }}
      >
        {/* Premium Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Content Container */}
        <div className="relative">
          <div className="max-w-[1920px] mx-auto px-8 py-16">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Featured Products</h2>
              <div className="w-24 h-1 bg-black mx-auto" />
            </div>

            {/* Products Grid */}
            <div className="relative">
              <ProductList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
