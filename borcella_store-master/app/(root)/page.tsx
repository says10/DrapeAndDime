import Carousel from "@/components/Carousel"; // Client Component for carousel
import { getProducts } from "@/lib/actions/actions"; // Import getProducts action

export default async function Home() {
  // Fetch products using the getProducts action
  const products = await getProducts();

  // Extract product media (images) from the fetched products
  const productImages = products.flatMap((product:ProductType) => product.media);

  // Shuffle images randomly and select 8
  const shuffledImages = productImages.sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <Carousel 
      productImages={shuffledImages} 
      products={products} 
    />
  );
}
