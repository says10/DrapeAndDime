"use client";

import { useState } from "react";
import { MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import FormattedText from "./FormattedText";
import HeartFavorite from "./HeartFavorite";
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
    <div className="max-w-[450px] flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Product Title & Wishlist Heart */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            {productInfo.title}
          </h1>
        </div>
        <div className="ml-4">
        <HeartFavorite product={productInfo} />
        </div>
      </div>

      {/* Product Category */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category:</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
          {productInfo.category}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
          <span className="text-xl text-gray-400 line-through font-medium">
            ₹{productInfo.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-4xl font-bold text-gray-900">
          ₹{productInfo.price.toLocaleString()}
        </span>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        <div className="text-gray-600 leading-relaxed">
        <FormattedText 
          text={productInfo.description} 
            className="text-base"
        />
        </div>
      </div>

      {/* Colors */}
      {productInfo.colors && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Color</h3>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedColor === productInfo.colors 
                  ? "border-gray-900 bg-gray-900 text-white shadow-md" 
                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
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
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Size</h3>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedSize === productInfo.sizes 
                  ? "border-gray-900 bg-gray-900 text-white shadow-md" 
                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedSize(productInfo.sizes)}
            >
              {productInfo.sizes}
            </button>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            className={`p-2 rounded-full transition-all duration-200 ${
              quantity > 1 
                ? "text-gray-700 hover:text-red-600 hover:bg-red-50" 
                : "text-gray-300 cursor-not-allowed"
            }`}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <MinusCircle className="w-6 h-6" />
          </button>
          <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            className={`p-2 rounded-full transition-all duration-200 ${
              isOutOfStock || quantity >= maxStock 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-700 hover:text-green-600 hover:bg-green-50"
            }`}
            onClick={() => {
              if (!isOutOfStock && quantity < maxStock) {
                setQuantity(quantity + 1);
              }
            }}
            disabled={isOutOfStock || quantity >= maxStock}
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Availability Message */}
      <div className={`p-4 rounded-xl ${
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
        className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] transform"
        }`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingToCart}
      >
        {isAddingToCart ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-6 h-6" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </>
        )}
        {!isOutOfStock && (
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      {/* Stock Status */}
      <div className={`p-4 rounded-xl ${
        isOutOfStock 
          ? "bg-red-50 border border-red-200" 
          : "bg-green-50 border border-green-200"
      }`}>
        <p className={`text-base font-medium ${
          isOutOfStock ? "text-red-700" : "text-green-700"
      }`}>
          {isOutOfStock ? "Currently out of stock" : "In stock and ready to ship"}
      </p>
      </div>
    </div>
  );
};

export default ProductInfo;