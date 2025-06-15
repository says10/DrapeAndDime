"use client"

import Image from "next/image";
import React, { useState } from "react";

const Gallery = ({ productMedia }: { productMedia: string[] }) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);

  return (
    <div className="flex flex-col gap-3 max-w-[500px]">
      <div className="relative w-[500px] h-[500px] bg-gray-100 rounded-lg shadow-xl flex items-center justify-center">
        <Image
          src={mainImage}
          alt="product"
          fill
          className="object-contain p-4"
          sizes="(max-width: 500px) 100vw, 500px"
          priority
        />
      </div>
      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {productMedia.map((image, index) => (
          <div 
            key={index}
            className={`relative w-20 h-20 cursor-pointer rounded-lg bg-gray-100 flex items-center justify-center ${
              mainImage === image ? "ring-2 ring-black" : ""
            }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt="product"
              fill
              className="object-contain p-1"
              sizes="(max-width: 80px) 100vw, 80px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
