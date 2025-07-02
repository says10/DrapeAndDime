"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

interface CollectionType {
  _id: string;
  image: string; // can be image or video URL
  name: string;
  headline?: string;
  ctaText?: string;
}

interface HomeProps {
  collectionImages: string[];
  collections: CollectionType[];
}

function isVideo(url: string) {
  return url.match(/\.(mp4|webm|ogg)$/i);
}

const Home = ({ collectionImages, collections }: HomeProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(collectionImages[0]);
  const [carouselVisible, setCarouselVisible] = useState(true);
  const [animationActive, setAnimationActive] = useState(true);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  // Slideshow logic: Change image every 3 seconds
  useEffect(() => {
    if (!animationActive) return;

    const interval = setInterval(() => {
      if (carouselVisible && selectedImage) {
        const currentIndex = collectionImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % collectionImages.length;
        setSelectedImage(collectionImages[nextIndex]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedImage, carouselVisible, collectionImages, animationActive]);

  // Handle image click: Match image URL to collection image URL and get corresponding collectionId
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setAnimationActive(false);

    if (collections && collections.length > 0) {
      const matchedCollection = collections.find((collection) => collection.image === image);
      if (matchedCollection) {
        console.log("Matching Collection ID:", matchedCollection._id);
        setSelectedCollectionId(matchedCollection._id);
      } else {
        console.error("No matching collection found for image:", image);
      }
    } else {
      console.error("Collections are not available or empty.");
    }
  };

  // Explore All Button Click Handler
  const handleExploreAllClick = () => {
    setCarouselVisible(false);
    router.push("/home");
  };

  // Shop Now Button Click Handler (redirect to collection page)
  const handleShopNowClick = () => {
    if (selectedCollectionId) {
      console.log("Redirecting to collection ID:", selectedCollectionId);
      router.push(`/collections/${selectedCollectionId}`);
    } else {
      console.error("No collection selected.");
    }
  };

  return (
    <>
      {/* Full-Screen Carousel */}
      {carouselVisible && (
        <div className="w-full aspect-video overflow-hidden bg-gray-100" style={{maxWidth: '100vw'}}>
          {/* Background Media (Image or Video) */}
          <div className="absolute inset-0 w-full h-full z-0">
            {selectedImage && isVideo(selectedImage) ? (
              <video
                src={selectedImage}
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
                style={{ aspectRatio: '16/9' }}
              />
            ) : selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected Collection"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
                quality={100}
                style={{ aspectRatio: '16/9' }}
              />
            ) : null}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          </div>
          {/* Overlay Content */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-2 sm:px-4">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 sm:mb-4 break-words">
              {collections[selectedIndex ?? 0]?.headline || 'Discover the Latest in Women\'s Fashion'}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-4 sm:mb-8 break-words">
              {collections[selectedIndex ?? 0]?.name || 'Trendy, Elegant, and Comfortable Styles for Every Woman'}
            </p>
            {selectedCollectionId && (
              <button
                onClick={handleShopNowClick}
                className="bg-white text-black px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold 
                  hover:bg-gray-100 transition-all duration-300 shadow-lg
                  transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
              >
                View Collection
              </button>
            )}
          </div>
          {/* Logo (Top Left) */}
          <Link href="/" className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={40} 
              className="object-contain"
              priority
            />
          </Link>
          {/* Login Icon (Top Right) */}
          <Link href="/sign-in" className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30">
            <CircleUserRound className="text-white w-6 h-6 sm:w-8 sm:h-8 cursor-pointer hover:text-gray-200 transition-colors" />
          </Link>
          {/* Carousel Thumbnails */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 justify-center items-center w-full px-2 sm:px-4 z-30 overflow-x-auto scrollbar-hide">
            {collectionImages.map((image, index) => (
              <div
                key={index}
                className={`relative w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 cursor-pointer transition-transform duration-300 hover:scale-110 ${
                  selectedImage === image ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => handleImageClick(image, index)}
              >
                {isVideo(image) ? (
                  <video
                    src={image}
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: '1/1' }}
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={image}
                    alt={`Collection Image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 40px) 100vw, 40px"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Explore All Button */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-30">
            <button 
              onClick={handleExploreAllClick}
              className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold 
                hover:bg-white/20 transition-all duration-300 border border-white/20
                hover:border-white/30 text-xs sm:text-base"
            >
              Explore All
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
