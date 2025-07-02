"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

interface CarouselItem {
  media: string;
  mediaType: "image" | "video";
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

interface VerticalCarouselProps {
  items: CarouselItem[];
}

const VerticalCarousel = ({ items }: VerticalCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Slideshow logic: Change image every 3 seconds
  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center text-gray-400 bg-gray-100 rounded-2xl shadow-2xl">
        No carousel items found.
      </div>
    );
  }

  const selectedItem = items[selectedIndex];

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] max-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gray-100 rounded-2xl shadow-2xl">
      {/* Background Media (Image or Video) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {selectedItem.mediaType === "video" ? (
          <video
            src={selectedItem.media}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src={selectedItem.media}
            alt={selectedItem.title || "Carousel Item"}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={100}
          />
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent z-10" />
      </div>
      {/* Overlay Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-2 py-8">
        <h1 className="text-xl font-extrabold text-white drop-shadow-lg mb-2 break-words">
          {selectedItem.title}
        </h1>
        <p className="text-base text-white/90 mb-4 break-words">
          {selectedItem.subtitle}
        </p>
        {selectedItem.cta && selectedItem.ctaLink && (
          <button
            onClick={() => router.push(selectedItem.ctaLink)}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg text-sm"
          >
            {selectedItem.cta}
          </button>
        )}
      </div>
      {/* Logo (Top Left) */}
      <Link href="/" className="absolute top-2 left-2 z-30">
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={60} 
          height={30} 
          className="object-contain"
          priority
        />
      </Link>
      {/* Login Icon (Top Right) */}
      <Link href="/sign-in" className="absolute top-2 right-2 z-30">
        <CircleUserRound className="text-white w-6 h-6 cursor-pointer hover:text-gray-200 transition-colors" />
      </Link>
      {/* Vertical Thumbnails */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-30 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
        {items.map((item, index) => (
          <div
            key={index}
            className={`relative w-10 h-10 cursor-pointer transition-transform duration-300 hover:scale-110 rounded-lg overflow-hidden border-2 ${
              selectedIndex === index ? 'border-white' : 'border-transparent'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {item.mediaType === "video" ? (
              <video
                src={item.media}
                className="object-cover w-full h-full rounded-lg"
                muted
                playsInline
              />
            ) : (
              <Image
                src={item.media}
                alt={item.title || `Carousel Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="40px"
              />
            )}
          </div>
        ))}
      </div>
      {/* Explore All Button */}
      <div className="absolute bottom-2 right-2 z-30">
        <button 
          onClick={() => router.push('/home')}
          className="bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-semibold 
            hover:bg-white/20 transition-all duration-300 border border-white/20
            hover:border-white/30 text-xs"
        >
          Explore All
        </button>
      </div>
    </div>
  );
};

export default VerticalCarousel; 