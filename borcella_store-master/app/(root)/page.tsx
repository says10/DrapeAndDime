import Carousel from "@/components/Carousel"; // Client Component for carousel
import VerticalCarousel from "@/components/VerticalCarousel"; // New vertical carousel for mobile
import { getCollections } from "@/lib/actions/actions"; // Import getCollections action
import { Suspense } from "react";

async function getMobileRootCarousel() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || ""}/api/mobile-root-carousel`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  // Fetch collections using the getCollections action
  const collections = await getCollections();

  // Extract collection images
  const collectionImages = collections.map((collection: CollectionType) => collection.image);

  // Shuffle images randomly and select 8
  const shuffledImages = collectionImages.sort(() => Math.random() - 0.5).slice(0, 8);

  // Fetch mobile root carousel items
  const mobileCarouselItems = await getMobileRootCarousel();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Mobile: Vertical Carousel (inside padded container) */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 md:px-8 flex flex-col justify-center items-center">
        <div className="block sm:hidden w-full">
          <VerticalCarousel items={mobileCarouselItems} />
        </div>
      </div>
      {/* Desktop: Full-Screen Carousel (outside padded container, truly full-width) */}
      <div className="hidden sm:block w-full">
    <Carousel 
      collectionImages={shuffledImages} 
      collections={collections} 
    />
      </div>
    </div>
  );
}
