import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import Image from "next/image";
import React from "react";

const CollectionDetails = async ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const collectionDetails = await getCollectionDetails(params.collectionId);

  return (
    <div className="related-products-container px-10 py-5 flex flex-col items-center gap-8">
      <div className="relative w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <Image
          src={collectionDetails.image}
          alt="collection"
          fill
          className="object-contain p-8"
          sizes="100vw"
          priority
        />
      </div>
      <p className="text-heading3-bold text-grey-2">{collectionDetails.title}</p>
      <p className="text-body-normal text-grey-2 text-center max-w-[900px]">{collectionDetails.description}</p>
      <div className="flex flex-wrap gap-16 justify-center">
        {collectionDetails.products.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

