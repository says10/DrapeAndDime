"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const isNew = product.tags && product.tags.includes('new');
  const isSale = product.originalPrice && product.price < product.originalPrice;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.media[0]}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew && (
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">New</span>
          )}
          {isSale && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Sale</span>
          )}
        </div>

        {/* Heart Favorite */}
        <div className="absolute top-2 right-2 z-10">
          <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-black text-white py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">${product.price}</span>
          {isSale && product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
