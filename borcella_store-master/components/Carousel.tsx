"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
 // Import ProductType

 const styles: Record<string, React.CSSProperties> = {
  carouselContainer: {
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carouselBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  carouselBackgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as React.CSSProperties["objectFit"], // ✅ Fix here
  },
  carouselCards: {
    position: "absolute",
    bottom: "20px",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    padding: "10px",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  carouselCard: {
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    borderRadius: "8px",
  },
  carouselCardImage: {
    borderRadius: "8px",
    transition: "transform 0.3s ease-in-out",
  },
  exploreAllContainer: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
  },
  exploreAllButton: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    border: "none",
    transition: "background-color 0.3s ease-in-out",
  },
  shopNowContainer: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 4,
    display: "none",
  },
  shopNowButton: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    border: "none",
    transition: "background-color 0.3s ease-in-out",
  },
  loginIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 5,
    color: "white",
    cursor: "pointer",
  },
  logo: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 5,
  },
};


interface HomeProps {
  collectionImages: string[]; // Array of collection image URLs
  collections: CollectionType[]; // Array of collections
}

export default function Home({ collectionImages, collections }: HomeProps) {
  console.log("Collection Images:", collectionImages);
  console.log("Collections:", collections);

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
        <div className="relative w-full h-screen overflow-hidden">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Collection"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
                quality={100}
              />
            )}
          </div>

          {/* Logo (Top Left) */}
          <Link href="/" className="absolute top-4 left-4 z-10">
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
          <Link href="/sign-in" className="absolute top-4 right-4 z-10">
            <CircleUserRound className="text-white w-8 h-8 cursor-pointer hover:text-gray-200 transition-colors" />
          </Link>

          {/* Carousel Cards */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 justify-center items-center w-full px-4">
            {collectionImages.map((image, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 cursor-pointer transition-transform duration-300 hover:scale-110 ${
                  selectedImage === image ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => handleImageClick(image, index)}
              >
                <Image
                  src={image}
                  alt={`Collection Image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 96px) 100vw, 96px"
                />
              </div>
            ))}
          </div>

          {/* Explore All Button */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={handleExploreAllClick}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Explore All
            </button>
          </div>
        </div>
      )}

      {/* Shop Now Button */}
      {showShopNowButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button 
            onClick={handleShopNowClick}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg"
          >
            View Collection
          </button>
        </div>
      )}
    </>
  );
}
