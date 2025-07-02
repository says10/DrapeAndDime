"use client";

import { useState, useEffect, useRef } from "react";
import { MinusCircle, PlusCircle, ShoppingBag, Star, Truck, Shield, RotateCcw, Check } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import FormattedText from "./FormattedText";
import { toast } from "sonner";
import HydrationSafe from "./HydrationSafe";

interface ProductInfoProps {
  productInfo: ProductType;
  productImageRef: any;
  triggerFlyToCart: (imgRect: DOMRect) => void;
}

const ProductInfo = ({ productInfo, productImageRef, triggerFlyToCart }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(productInfo.colors || "");
  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productReviews, setProductReviews] = useState({
    avgRating: 0,
    totalReviews: 0,
    text: "No reviews yet"
  });
  const [buttonPulse, setButtonPulse] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const cart = useCart();
  const maxStock = productInfo.quantity;
  const isOutOfStock = maxStock === 0;

  // Fetch real reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productInfo._id}/reviews?page=1&limit=1`);
        const data = await response.json();
        
        if (response.ok) {
          const avgRating = data.avgRating || 0;
          const totalReviews = data.totalReviews || 0;
          
          const getReviewText = (rating: number) => {
            if (rating >= 4.5) return "Excellent";
            if (rating >= 4.0) return "Great";
            if (rating >= 3.5) return "Good";
            if (rating >= 3.0) return "Fair";
            if (rating > 0) return "Poor";
            return "No reviews yet";
          };
          
          setProductReviews({
            avgRating,
            totalReviews,
            text: getReviewText(avgRating)
          });
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productInfo._id]);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      setIsAddingToCart(true);
      try {
        if (productImageRef && productImageRef.current) {
          const imgRect = productImageRef.current.getBoundingClientRect();
          triggerFlyToCart(imgRect);
        }
        cart.addItem({
          item: productInfo,
          quantity,
          color: selectedColor,
          size: selectedSize,
        });
        toast.success("Added to cart!", {
          description: `${productInfo.title} has been added to your cart.`,
          duration: 3000,
        });
        setButtonPulse(true);
        setTimeout(() => setButtonPulse(false), 500);
        setShowCheckmark(true);
        setTimeout(() => setShowCheckmark(false), 1200);
        const cartIcon = document.querySelector('.cart-navbar-icon');
        if (cartIcon) {
          cartIcon.classList.add('cart-bounce');
          setTimeout(() => cartIcon.classList.remove('cart-bounce'), 700);
        }
      } catch (error) {
        toast.error("Failed to add to cart", {
          description: "Please try again later.",
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  return (
    <HydrationSafe fallback={
      <div className="flex flex-col gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 h-fit">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-6 rounded-2xl bg-gray-100">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    }>
      <div className="flex flex-col gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 h-fit">
        {/* Product Title & Category */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              {productInfo.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight font-serif">
              {productInfo.title}
            </h1>
          </div>
          
          {/* Dynamic Rating from Database */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${
                    i < Math.floor(productReviews.avgRating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : i < productReviews.avgRating 
                        ? "fill-yellow-400/50 text-yellow-400" 
                        : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-semibold">
                {productReviews.avgRating > 0 ? productReviews.avgRating : "—"}
              </span>
              <span className="text-gray-600 font-medium">
                ({productReviews.totalReviews} reviews)
              </span>
              <span className="text-sm text-gray-500">• {productReviews.text}</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-4">
            {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
              <span className="text-2xl text-gray-400 line-through font-light">
                ₹{productInfo.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-5xl font-bold text-gray-900">
              ₹{productInfo.price.toLocaleString()}
            </span>
          </div>
          {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
              Save ₹{(productInfo.originalPrice - productInfo.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={`p-6 rounded-2xl ${
          isOutOfStock 
            ? "bg-red-50 border border-red-200" 
            : "bg-green-50 border border-green-200"
        }`}>
          <p className={`text-lg font-semibold ${
            isOutOfStock ? "text-red-700" : "text-green-700"
          }`}>
            {isOutOfStock ? "Sold Out" : `${maxStock} items available`}
          </p>
        </div>

        {/* Product Options - Color and Size Side by Side */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Colors */}
            {productInfo.colors && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 font-serif">Color</h3>
                <button
                  className={`w-full px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    selectedColor === productInfo.colors 
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg transform scale-105" 
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedColor(productInfo.colors)}
                >
                  {productInfo.colors}
                </button>
              </div>
            )}

            {/* Sizes */}
            {productInfo.sizes && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 font-serif">Size</h3>
                <button
                  className={`w-full px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    selectedSize === productInfo.sizes 
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg transform scale-105" 
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSize(productInfo.sizes)}
                >
                  {productInfo.sizes}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`group relative flex items-center justify-center gap-4 px-8 py-5 rounded-2xl text-xl font-bold transition-all duration-300 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 hover:shadow-2xl active:scale-[0.98] transform"
          } ${buttonPulse ? 'button-pulse' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : showCheckmark ? (
            <>
              <Check className="w-6 h-6 checkmark-pop" />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag className="w-6 h-6" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-center gap-2 text-center">
            <Truck className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <RotateCcw className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Easy Returns</span>
          </div>
        </div>
      </div>
    </HydrationSafe>
  );
};

export default ProductInfo;