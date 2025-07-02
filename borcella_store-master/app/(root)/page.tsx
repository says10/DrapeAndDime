import Carousel from "@/components/Carousel"; // Client Component for carousel
import { getCollections } from "@/lib/actions/actions"; // Import getCollections action

export default async function Home() {
  // Fetch collections using the getCollections action
  const collections = await getCollections();

  // Extract collection images
  const collectionImages = collections.map((collection: CollectionType) => collection.image);

  // Shuffle images randomly and select 8
  const shuffledImages = collectionImages.sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8">
        <Carousel 
          collectionImages={shuffledImages} 
          collections={collections} 
        />
      </div>
    </div>
  );
}
