"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
  showHeart?: boolean;
}

const ProductCard = ({ product, updateSignedInUser, showHeart = true }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative flex flex-col bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <Image
          src={product.media[0]}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        {/* Heart Favorite - Only show if showHeart is true */}
        {showHeart && (
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-black transition-colors tracking-wide">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-3">
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight tracking-tight group-hover:text-gray-700 transition-colors">
          {product.title}
        </h3>
        
        {/* Category */}
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {product.category}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            )}
          </div>
          
          {/* Availability Badge - Only show when out of stock */}
          {!product.isAvailable && (
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
