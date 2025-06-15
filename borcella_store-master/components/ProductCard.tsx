"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps ) => {
  return (
    
    <Link
      href={`/products/${product._id}`}
      className="w-[220px] flex flex-col gap-2"
    >
      <div className="relative w-full h-[250px] bg-gray-50 rounded-lg flex items-center justify-center">
        <Image
          src={product.media[0]}
          alt="product"
          fill
          className="object-contain p-4"
          sizes="(max-width: 220px) 100vw, 220px"
          priority
        />
      </div>
      <div>
        <p className="text-base-bold">{product.title}</p>
        <p className="text-small-medium text-grey-2">{product.category}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-body-bold">₹{product.price}</p>
        <p className="text-small-medium text-grey-2 line-through">₹{product.originalPrice}</p>
      </div>
      <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
    </Link>
  );
};

export default ProductCard;
