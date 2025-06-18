"use client";

import { useState } from "react";
import { MinusCircle, PlusCircle, ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import FormattedText from "./FormattedText";
import { toast } from "sonner";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
  const [selectedColor, setSelectedColor] = useState<string>(productInfo.colors || "");
  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const cart = useCart();
  const maxStock = productInfo.quantity;
  const isOutOfStock = maxStock === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      setIsAddingToCart(true);
      try {
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
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-600 font-medium">(4.8 • 127 reviews)</span>
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

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 font-serif">Description</h3>
        <div className="text-gray-600 leading-relaxed text-lg">
          <FormattedText 
            text={productInfo.description} 
            className="text-base"
          />
        </div>
      </div>

      {/* Product Options */}
      <div className="space-y-6">
        {/* Colors */}
        {productInfo.colors && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 font-serif">Color</h3>
            <div className="flex gap-3">
              <button
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                  selectedColor === productInfo.colors 
                    ? "border-gray-900 bg-gray-900 text-white shadow-lg transform scale-105" 
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
                }`}
                onClick={() => setSelectedColor(productInfo.colors)}
              >
                {productInfo.colors}
              </button>
            </div>
          </div>
        )}

        {/* Sizes */}
        {productInfo.sizes && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 font-serif">Size</h3>
            <div className="flex gap-3">
              <button
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                  selectedSize === productInfo.sizes 
                    ? "border-gray-900 bg-gray-900 text-white shadow-lg transform scale-105" 
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
                }`}
                onClick={() => setSelectedSize(productInfo.sizes)}
              >
                {productInfo.sizes}
              </button>
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 font-serif">Quantity</h3>
          <div className="flex items-center gap-6">
            <button
              className={`p-3 rounded-full transition-all duration-300 ${
                quantity > 1 
                  ? "text-gray-700 hover:text-red-600 hover:bg-red-50 shadow-md" 
                  : "text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              <MinusCircle className="w-7 h-7" />
            </button>
            <span className="text-3xl font-bold text-gray-900 min-w-[4rem] text-center">
              {quantity}
            </span>
            <button
              className={`p-3 rounded-full transition-all duration-300 ${
                isOutOfStock || quantity >= maxStock 
                  ? "text-gray-300 cursor-not-allowed" 
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50 shadow-md"
              }`}
              onClick={() => {
                if (!isOutOfStock && quantity < maxStock) {
                  setQuantity(quantity + 1);
                }
              }}
              disabled={isOutOfStock || quantity >= maxStock}
            >
              <PlusCircle className="w-7 h-7" />
            </button>
          </div>
        </div>
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

      {/* Add to Cart Button */}
      <button
        className={`group relative flex items-center justify-center gap-4 px-8 py-5 rounded-2xl text-xl font-bold transition-all duration-300 ${
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 hover:shadow-2xl active:scale-[0.98] transform"
        }`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingToCart}
      >
        {isAddingToCart ? (
          <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-7 h-7" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
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
  );
};

export default ProductInfo;