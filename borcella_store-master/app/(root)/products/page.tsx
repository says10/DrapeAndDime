import { getProducts } from "@/lib/actions/actions";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "All Products - Borcella",
  description: "Browse our complete collection of fashion products. Find the latest trends in clothing, accessories, and more.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "All Products - Borcella",
    description: "Browse our complete collection of fashion products. Find the latest trends in clothing, accessories, and more.",
    type: "website",
    url: "https://drapeanddime.shop/products",
  },
  alternates: {
    canonical: "https://drapeanddime.shop/products",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();
  
  return <ProductsClient initialProducts={products || []} />;
} 