import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import Image from "next/image";
import React from "react";

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

const CollectionDetails = async ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const collectionDetails = await getCollectionDetails(params.collectionId);

  return (
    <div className="max-w-[1920px] mx-auto px-8 py-12">
      {/* Collection Media */}
      <div className="relative w-full aspect-[21/9] mb-12 rounded-lg overflow-hidden bg-gray-50">
        {isVideo(collectionDetails.image) ? (
          <video
            src={collectionDetails.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={collectionDetails.image}
            alt={collectionDetails.title}
            fill
            className="object-cover"
            sizes="(max-width: 1920px) 100vw, 1920px"
            priority
          />
        )}
        {/* Optional overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Collection Info */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">{collectionDetails.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {collectionDetails.description}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectionDetails.products.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

