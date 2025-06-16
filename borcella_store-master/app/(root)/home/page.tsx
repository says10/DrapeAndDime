// app/home/page.tsx

import Image from "next/image";
import CollectionCarousel from "@/components/CollectionCarousel";
import ProductList from "@/components/ProductList";
import { getCollections } from "@/lib/actions/actions";

export default async function Home() {
  const collections = await getCollections();
  return (
    <>
      {/* Original Homepage Content */}
      <div className="banner-container">
        <Image src="/banner.png" alt="banner" width={2000} height={1000} className="w-screen" />
      </div>

      {/* Collections Carousel (displays 3 collections at a time with left/right buttons) */}
      <CollectionCarousel collections={collections} />

      {/* Products (displayed in a slightly different UI, e.g. a grid of 3 products) */}
      <div className="w-full px-4 py-8 bg-white">
         <h2 className="text-heading1-bold mb-4 text-center">Featured Products</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductList />
         </div>
      </div>
    </>
  );
}
