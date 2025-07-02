"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionType {
  _id: string;
  image: string; // can be image or video URL
  title: string;
  headline?: string;
  ctaText?: string;
}

interface CollectionCarouselProps {
  collections: CollectionType[];
}

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

export default function CollectionCarousel({ collections }: CollectionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = collections.length;
  const slideWidth = 100 / 3; // (display 3 collections at a time on desktop)
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mobile swipe/scroll handler
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const slide = Math.round(scrollLeft / scrollRef.current.offsetWidth);
    setCurrentIndex(slide);
  };

  return (
    <div className="collections-section relative w-full overflow-x-hidden bg-gray-100 py-6 sm:py-8 px-2 sm:px-4">
      <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
        <h2 className="text-lg sm:text-2xl font-bold">Collections</h2>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)} className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrentIndex((prev) => (prev + 1) % totalSlides)} className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Mobile: horizontal scroll, Desktop: carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto sm:overflow-x-hidden snap-x snap-mandatory pb-2 sm:pb-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {collections.map((collection, index) => (
          <div
            key={collection._id}
            className="snap-center flex-shrink-0 w-4/5 sm:w-1/3 px-1 sm:px-2"
            style={{ maxWidth: '350px' }}
          >
            <Link href={`/collections/${collection._id}`} className="block w-full">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-200 shadow-lg">
                {isVideo(collection.image) ? (
                  <video
                    src={collection.image}
                    className="object-cover w-full h-full"
                    style={{ aspectRatio: '16/9' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 350px) 100vw, 350px"
                    priority
                    style={{ aspectRatio: '16/9' }}
                  />
                )}
              </div>
              <h3 className="mt-2 text-center font-semibold text-pink-700 text-base sm:text-lg truncate">{collection.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 