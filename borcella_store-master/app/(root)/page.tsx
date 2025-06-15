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
    <Carousel 
      collectionImages={shuffledImages} 
      collections={collections} 
    />
  );
}
