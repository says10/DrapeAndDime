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

interface CollectionType {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: string[];
}

interface ProductType {
  _id: string;
  title: string;
  description: string;
  media: string[];
  category: string;
  collections: string[];
  // ... other product fields
}

interface HomeProps {
  productImages: string[];
  products: (ProductType | CollectionType)[];
  isCollection?: boolean;
}

export default function Home({ productImages, products, isCollection = false }: HomeProps) {
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

  // Handle image click: Match image URL to product/collection image and get corresponding ID
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setAnimationActive(false);
    setShowShopNowButton(true);

    if (products && products.length > 0) {
      if (isCollection) {
        // Handle collections
        const matchedCollection = products.find((item): item is CollectionType => 
          'image' in item && item.image === image
        );
        if (matchedCollection) {
          console.log("Matching Collection ID:", matchedCollection._id);
          setSelectedProductId(matchedCollection._id);
        } else {
          console.error("No matching collection found for image:", image);
        }
      } else {
        // Handle products
        const matchedProduct = products.find((item): item is ProductType => 
          'media' in item && item.media[0] === image
        );
        if (matchedProduct) {
          console.log("Matching Product ID:", matchedProduct._id);
          setSelectedProductId(matchedProduct._id);
        } else {
          console.error("No matching product found for image:", image);
        }
      }
    } else {
      console.error("Products/Collections are not available or empty.");
    }
  };

  // Shop Now Button Click Handler (redirect using the stored ID)
  const handleShopNowClick = () => {
    if (selectedProductId) {
      if (isCollection) {
        router.push(`/collections/${selectedProductId}`); // Redirect to collection page
      } else {
        router.push(`/products/${selectedProductId}`); // Redirect to product page
      }
    } else {
      console.error("No item selected.");
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
                onClick={() => handleImageClick(image, index)}
              >
                <Image
                  src={image}
                  alt={`${isCollection ? 'Collection' : 'Product'} Image ${index + 1}`}
                  width={100}
                  height={100}
                  style={styles.carouselCardImage}
                />
              </div>
            ))}
          </div>

          {/* Explore All Button */}
          <div style={styles.exploreAllContainer}>
            <button 
              style={styles.exploreAllButton} 
              onClick={() => router.push(isCollection ? '/collections' : '/home')}
            >
              Explore All {isCollection ? 'Collections' : 'Products'}
            </button>
          </div>
        </div>
      )}

      {/* Shop Now Button */}
      {showShopNowButton && (
        <div style={{ ...styles.shopNowContainer, display: "block" }}>
          <button onClick={handleShopNowClick} style={styles.shopNowButton}>
            {isCollection ? 'View Collection' : 'Shop Now'}
          </button>
        </div>
      )}
    </>
  );
}
