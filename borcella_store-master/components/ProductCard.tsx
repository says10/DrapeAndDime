"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative flex flex-col bg-white overflow-hidden"
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
        
        {/* Heart Favorite */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-black text-white py-3 rounded-none text-sm font-medium hover:bg-gray-900 transition-colors">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-gray-900">${product.price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
