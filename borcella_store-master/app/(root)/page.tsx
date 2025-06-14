import Carousel from "@/components/Carousel"; // Client Component for carousel
import { getCollections } from "@/lib/actions/actions"; // Import getCollections action

export default async function Home() {
  // Fetch collections using the getCollections action
  const collections = await getCollections();

  // Extract collection images from the fetched collections
  const collectionImages = collections.map((collection: CollectionType) => collection.image);

  // Shuffle images randomly and select 8
  const shuffledImages = collectionImages.sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <Carousel 
      productImages={shuffledImages} 
      products={collections} // Pass collections instead of products
      isCollection={true} // Add flag to indicate we're showing collections
    />
  );
}
