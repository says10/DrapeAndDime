import { getCollections } from "@/lib/actions/actions";
import type { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "Collections - Borcella",
  description: "Explore our curated collections of fashion products. Find the perfect style for every occasion.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Collections - Borcella",
    description: "Explore our curated collections of fashion products. Find the perfect style for every occasion.",
    type: "website",
    url: "https://drapeanddime.shop/collections",
  },
  alternates: {
    canonical: "https://drapeanddime.shop/collections",
  },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  
  return <CollectionsClient collections={collections || []} />;
} 