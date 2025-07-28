"use client"

import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import ReviewsList from "@/components/ReviewsList";
import { Package, Heart, Share2, ChevronRight, Home, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDetailsClientProps {
  productId: string;
  initialProduct: ProductType | null;
  initialRelatedProducts: ProductType[];
}

const ProductDetailsClient = ({ 
  productId, 
  initialProduct, 
  initialRelatedProducts 
}: ProductDetailsClientProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [productDetails, setProductDetails] = useState<ProductType | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>(initialRelatedProducts);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const productImageRef = useRef<HTMLDivElement>(null);
  const [flyImage, setFlyImage] = useState<null | { x: number; y: number; src: string }>(null);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user && productDetails) {
        try {
          const res = await fetch(`/api/users?userId=${user.id}`);
          const userData = await res.json();
          setIsInWishlist(userData.wishlist?.includes(productId) || false);
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      }
    };

    checkWishlist();
  }, [user, productId, productDetails]);

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId: productId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();
      setIsInWishlist(data.wishlist.includes(productId));
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleReviewSubmitted = () => {
    // This will be called when a new review is submitted
    // The ProductInfo component will automatically refresh its rating display
  };

  // Find the cart icon in the navbar (by id or class if possible)
  const getCartIconRect = () => {
    const cartIcon = document.querySelector(".cart-navbar-icon");
    if (cartIcon) {
      return cartIcon.getBoundingClientRect();
    }
    // Fallback: try to find by common cart icon selectors
    const fallbackSelectors = [
      '[data-testid="cart-icon"]',
      '.cart-icon',
      '[aria-label*="cart" i]',
      '[title*="cart" i]'
    ];
    
    for (const selector of fallbackSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.getBoundingClientRect();
      }
    }
    
    return null;
  };

  const triggerFlyToCart = (imgRect: DOMRect) => {
    const cartRect = getCartIconRect();
    if (!cartRect) return;

    const flyImageElement = document.createElement('div');
    flyImageElement.style.cssText = `
      position: fixed;
      top: ${imgRect.top}px;
      left: ${imgRect.left}px;
      width: ${imgRect.width}px;
      height: ${imgRect.height}px;
                  background-image: url('${productDetails?.media?.[0] || ''}');
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      z-index: 9999;
      pointer-events: none;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    document.body.appendChild(flyImageElement);

    // Trigger animation
    requestAnimationFrame(() => {
      flyImageElement.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.1)`;
      flyImageElement.style.opacity = '0';
    });

    // Clean up
    setTimeout(() => {
      document.body.removeChild(flyImageElement);
    }, 800);
  };

  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <button
            onClick={() => router.push("/")}
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => router.push("/products")}
            className="hover:text-gray-700 transition-colors"
          >
            Products
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{productDetails.title}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div ref={productImageRef}>
            <Gallery productMedia={productDetails.media || []} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <ProductInfo 
              productInfo={productDetails}
              productImageRef={productImageRef}
              triggerFlyToCart={triggerFlyToCart}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isInWishlist
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {isShareCopied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Product Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsList productId={productId} onReviewSubmitted={handleReviewSubmitted} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsClient; 