"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps ) => {
  const isNew = product.tags && product.tags.includes('new');
  const isSale = product.originalPrice && product.price < product.originalPrice;
  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[220px] flex flex-col gap-2 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden border border-gray-100 hover:scale-105 transform transition-transform"
    >
      <div className="relative w-full h-[250px] rounded-t-xl overflow-hidden">
        <Image
          src={product.media[0]}
          alt="product"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 220px) 100vw, 220px"
          priority
        />
        {/* Badge */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">New</span>
        )}
        {isSale && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Sale</span>
        )}
        {/* Add to Cart Button (shows on hover) */}
        <button
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-pink-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 z-20"
          onClick={e => { e.preventDefault(); /* Add to cart logic here */ }}
        >
          Add to Cart
        </button>
      </div>
      <div className="px-2 py-1 flex flex-col gap-1">
        <p className="text-base font-semibold text-gray-900 truncate">{product.title}</p>
        <p className="text-sm text-pink-700 font-medium">{product.category}</p>
      </div>
      <div className="flex items-center gap-2 px-2 pb-2">
        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
        {isSale && (
          <p className="text-sm text-gray-400 line-through">₹{product.originalPrice}</p>
        )}
      </div>
      <div className="absolute top-2 right-2 z-20">
        <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
      </div>
    </Link>
  );
};

export default ProductCard;
