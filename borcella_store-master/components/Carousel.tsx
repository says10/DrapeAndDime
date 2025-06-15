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
        <div style={styles.carouselContainer}>
          <div style={styles.carouselBackground}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Collection"
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Logo (Top Left) */}
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={130} height={100} className="absolute top-[10px] left-[10px] z-[5]" />
          </Link>

          {/* Login Icon (Top Right) */}
          <Link href="/sign-in">
            <CircleUserRound className="absolute top-[10px] right-[10px] z-[5] text-white cursor-pointer" />
          </Link>

          {/* Carousel Cards */}
          <div style={styles.carouselCards}>
            {collectionImages.map((image, index) => (
              <div
                key={index}
                style={styles.carouselCard}
                onClick={() => handleImageClick(image, index)}
              >
                <Image
                  src={image}
                  alt={`Collection Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg transition-transform duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>

          {/* Explore All Button */}
          <div style={styles.exploreAllContainer}>
            <button style={styles.exploreAllButton} onClick={handleExploreAllClick}>
              Explore All
            </button>
          </div>
        </div>
      )}

      {/* Shop Now Button (after selecting image) */}
      {showShopNowButton && (
        <div style={{ ...styles.shopNowContainer, display: "block" }}>
          <button onClick={handleShopNowClick} style={styles.shopNowButton}>
            View Collection
          </button>
        </div>
      )}
    </>
  );
}
