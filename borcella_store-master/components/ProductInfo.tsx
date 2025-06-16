"use client";

import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import useCart from "@/lib/hooks/useCart"; // Ensure correct import
import FormattedText from "./FormattedText";
// import { toast } from "sonner"; // Temporarily commented out

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
        // toast.success("Added to cart!", {
        //   description: `${productInfo.title} has been added to your cart.`,
        //   duration: 3000,
        // });
        console.log("Added to cart:", productInfo.title); // Temporary console log
      } catch (error) {
        // toast.error("Failed to add to cart");
        console.error("Failed to add to cart:", error); // Temporary console log
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  return (
    <div className="max-w-[400px] flex flex-col gap-4">
      {/* Product Title & Favorite Icon */}
      <div className="flex justify-between items-center">
        <p className="text-heading3-bold">{productInfo.title}</p>
        <HeartFavorite product={productInfo} />
      </div>

      {/* Product Category */}
      <div className="flex gap-2">
        <p className="text-base-medium text-grey-2">Category:</p>
        <p className="text-base-bold">{productInfo.category}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
          <span className="text-gray-500 line-through text-lg">
            ₹ {productInfo.originalPrice}
          </span>
        )}
        <span className="text-heading3-bold text-black-600">
          ₹ {productInfo.price}
        </span>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Description:</p>
        <FormattedText 
          text={productInfo.description} 
          className="text-small-medium"
        />
      </div>

      {/* Colors */}
      {productInfo.colors && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Color:</p>
          <div className="flex gap-2">
            <p
              className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${
                selectedColor === productInfo.colors ? "bg-black text-white bg-opacity-50" : ""
              }`}
              onClick={() => setSelectedColor(productInfo.colors)}
            >
              {productInfo.colors}
            </p>
          </div>
        </div>
      )}

      {/* Sizes */}
      {productInfo.sizes && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Size:</p>
          <div className="flex gap-2">
            <p
              className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${
                selectedSize === productInfo.sizes ? "bg-black text-white bg-opacity-50" : ""
              }`}
              onClick={() => setSelectedSize(productInfo.sizes)}
            >
              {productInfo.sizes}
            </p>
          </div>
        </div>
      )}

      {/* Quantity Selector (Disabled if Out of Stock) */}
      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Quantity:</p>
        <div className="flex gap-4 items-center">
          <MinusCircle
            className={`cursor-pointer ${quantity > 1 ? "hover:text-red-1" : "text-gray-400"}`}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className={`cursor-pointer ${
              isOutOfStock || quantity >= maxStock ? "text-gray-400" : "hover:text-red-1"
            }`}
            onClick={() => {
              if (!isOutOfStock && quantity < maxStock) {
                setQuantity(quantity + 1);
              }
            }}
          />
        </div>
      </div>

      {/* Availability Message */}
      <p className={`text-lg font-semibold ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
        {isOutOfStock ? "Out of Stock ❌" : `In Stock ✅ (${maxStock} available)`}
      </p>

      {/* Add to Cart Button (Disabled if Out of Stock) */}
      <button
        className={`group relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
        }`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingToCart}
      >
        {isAddingToCart ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </>
        )}
        {!isOutOfStock && (
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      {/* Stock Status */}
      <p className={`text-sm font-medium ${
        isOutOfStock 
          ? "text-red-600 bg-red-50 px-3 py-2 rounded-lg" 
          : "text-green-600 bg-green-50 px-3 py-2 rounded-lg"
      }`}>
        {isOutOfStock ? (
          "Currently out of stock"
        ) : (
          `${maxStock} units available`
        )}
      </p>
    </div>
  );
};

export default ProductInfo;