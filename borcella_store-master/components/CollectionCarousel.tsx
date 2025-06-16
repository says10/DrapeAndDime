"use client";

import { useState } from "react";
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
  const slideWidth = 100 / 3; // (display 3 collections at a time)

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 py-8 px-4">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-heading1-bold">Collections</h2>
         <div className="flex gap-2">
            <button onClick={goPrev} className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow transition-all">
               <ChevronLeft className="w-6 h 6" />
            </button>
            <button onClick={goNext} className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow transition-all">
               <ChevronRight className="w 6 h 6" />
            </button>
         </div>
      </div>
      <div className="relative w-full overflow-hidden">
         <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
         >
            {collections.map((collection, index) => (
               <div key={collection._id} className="flex-shrink-0 w-1/3 px-2">
                  <Link href={`/collections/${collection._id}`} className="block w-full">
                     <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
                        {isVideo(collection.image) ? (
                           <video
                              src={collection.image}
                              className="object-cover w-full h-full"
                              style={{ aspectRatio: '16/9' }}
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
                     <h3 className="mt-2 text-center font-semibold text-pink-700">{collection.title}</h3>
                  </Link>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
} 