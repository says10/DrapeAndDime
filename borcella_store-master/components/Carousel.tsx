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
  const [showShopNowButton, setShowShopNowButton] = useState(false);
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
    setShowShopNowButton(true);

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
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
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
            <div className="absolute inset-0 bg-gradient-to-t from-pink-200/80 via-white/30 to-transparent z-10" />
          </div>
          {/* Overlay Content */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-pink-700 drop-shadow-lg mb-4">
              {collections[selectedIndex ?? 0]?.headline || 'Discover the Latest in Women\'s Fashion'}
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-6">
              {collections[selectedIndex ?? 0]?.name || 'Trendy, Elegant, and Comfortable Styles for Every Woman'}
            </p>
            <button
              onClick={handleShopNowClick}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
            >
              {collections[selectedIndex ?? 0]?.ctaText || 'Shop Now'}
            </button>
          </div>
          {/* Logo (Top Left) */}
          <Link href="/" className="absolute top-4 left-4 z-30">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={130} 
              height={100} 
              className="object-contain"
              priority
            />
          </Link>
          {/* Login Icon (Top Right) */}
          <Link href="/sign-in" className="absolute top-4 right-4 z-30">
            <CircleUserRound className="text-pink-700 w-8 h-8 cursor-pointer hover:text-pink-500 transition-colors" />
          </Link>
          {/* Carousel Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 justify-center items-center w-full px-4 z-30">
            {collectionImages.map((image, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 md:w-24 md:h-24 cursor-pointer transition-transform duration-300 hover:scale-110 ${
                  selectedImage === image ? 'ring-2 ring-pink-400' : ''
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
                    sizes="(max-width: 96px) 100vw, 96px"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Explore All Button */}
          <div className="absolute bottom-4 right-4 z-30">
            <button 
              onClick={handleExploreAllClick}
              className="bg-white/90 backdrop-blur-sm text-pink-700 px-6 py-2 rounded-full font-semibold 
                hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl
                border border-pink-200 hover:border-pink-300"
            >
              Explore All
            </button>
          </div>
        </div>
      )}

      {/* Shop Now Button - Kept in original position */}
      {showShopNowButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button 
            onClick={handleShopNowClick}
            className="bg-black/90 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold 
              hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl
              border border-gray-800 hover:border-gray-700
              transform hover:-translate-y-0.5 active:translate-y-0"
          >
            View Collection
          </button>
        </div>
      )}
    </>
  );
};

export default Home;
