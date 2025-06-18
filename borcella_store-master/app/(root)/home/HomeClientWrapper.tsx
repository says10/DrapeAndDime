"use client";

import Image from "next/image";
import CollectionCarousel from "@/components/CollectionCarousel";
import ProductList from "@/components/ProductList";
import VerticalBanners from "@/components/VerticalBanners";
import HomeBanner from "@/components/HomeBanner";
import ScrollEffectsWrapper from "@/components/ScrollEffectsWrapper";

interface HomeClientWrapperProps {
  collections: CollectionType[];
}

export default function HomeClientWrapper({ collections }: HomeClientWrapperProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Banner with 16:9 Aspect Ratio */}
      <HomeBanner />

      {/* Collections Carousel */}
      <ScrollEffectsWrapper scrollThreshold={200}>
        <CollectionCarousel collections={collections} />
      </ScrollEffectsWrapper>

      {/* Vertical Banners (9:16) */}
      <ScrollEffectsWrapper scrollThreshold={400}>
        <VerticalBanners />
      </ScrollEffectsWrapper>

      {/* Products Section with Premium Background */}
      <ScrollEffectsWrapper scrollThreshold={600}>
        <div className="w-full relative">
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
      </ScrollEffectsWrapper>
    </div>
  );
} 