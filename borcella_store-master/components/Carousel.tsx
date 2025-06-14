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
  productImages: string[]; // Array of image URLs (Cloudinary)
  productIds?: string[]; // Array of product IDs (MongoDB)
  products: ProductType[]; // Array of products from MongoDB (to be used for matching media[0])
}

export default function Home({ productImages, products }: HomeProps) {
  console.log("Product Images:", productImages); // Ensure images array is populated
  console.log("Products:", products); // Debugging to check if products are passed correctly

  const [selectedImage, setSelectedImage] = useState<string | null>(productImages[0]);
  const [carouselVisible, setCarouselVisible] = useState(true); // Controls carousel visibility
  const [animationActive, setAnimationActive] = useState(true); // Controls animation for image slideshow
  const [showShopNowButton, setShowShopNowButton] = useState(false); // Controls visibility of Shop Now button
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Store selected product ID
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Stores the clicked index
  const router = useRouter();

  // Slideshow logic: Change image every 3 seconds
  useEffect(() => {
    if (!animationActive) return; // Stop slideshow animation when animation is disabled

    const interval = setInterval(() => {
      if (carouselVisible && selectedImage) {
        const currentIndex = productImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % productImages.length;
        setSelectedImage(productImages[nextIndex]);
      }
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [selectedImage, carouselVisible, productImages, animationActive]);

  // Handle image click: Match image URL to product media[0] URL and get corresponding productId
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image); // Set the clicked image as the background
    setSelectedIndex(index); // Store the clicked index
    setAnimationActive(false); // Stop the animation when an image is clicked
    setShowShopNowButton(true); // Show the Shop Now button when an image is selected

    // Check if products are available before proceeding
    if (products && products.length > 0) {
      // Find the corresponding productId by matching media[0] URL with the image URL
      const matchedProduct = products.find((product) => product.media[0] === image);
      if (matchedProduct) {
        console.log("Matching Product ID:", matchedProduct._id); // Print the matched product ID
        setSelectedProductId(matchedProduct._id); // Store the productId for future use
      } else {
        console.error("No matching product found for image:", image);
      }
    } else {
      console.error("Products are not available or empty.");
    }
  };

  // Explore All Button Click Handler
  const handleExploreAllClick = () => {
    setCarouselVisible(false); // Hide the carousel when "Explore All" is clicked
    router.push("/home"); // Redirect to /home
  };

  // Shop Now Button Click Handler (redirect using the stored productId)
  const handleShopNowClick = () => {
    if (selectedProductId) {
      console.log("Redirecting to product ID:", selectedProductId); // Check if the product ID is correct
      router.push(`/products/${selectedProductId}`); // Redirect to the product page using the stored productId
    } else {
      console.error("No product selected.");
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
                alt="Selected Product"
                layout="fill"
                objectFit="cover"
                style={styles.carouselBackgroundImage}
              />
            )}
          </div>

          {/* Logo (Top Left) */}
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={130} height={100} style={styles.logo} />
          </Link>

          {/* Login Icon (Top Right) */}
          <Link href="/sign-in">
            <CircleUserRound style={styles.loginIcon} />
          </Link>

          {/* Carousel Cards */}
          <div style={styles.carouselCards}>
            {productImages.map((image, index) => (
              <div
                key={index}
                style={styles.carouselCard}
                onClick={() => handleImageClick(image, index)} // Pass the index here
              >
                <Image
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  width={100}
                  height={100}
                  style={styles.carouselCardImage}
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
            Shop Now
          </button>
        </div>
      )}
    </>
  );
}
