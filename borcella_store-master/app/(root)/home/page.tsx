// app/home/page.tsx

import Image from "next/image";
import CollectionCarousel from "@/components/CollectionCarousel";
import ProductList from "@/components/ProductList";
import VerticalBanners from "@/components/VerticalBanners";
import { getCollections } from "@/lib/actions/actions";
import HomeBanner from "@/components/HomeBanner";
import HomeClientWrapper from "./HomeClientWrapper";

export default async function Home() {
  const collections = await getCollections();
  
  return (
    <HomeClientWrapper collections={collections} />
  );
}
