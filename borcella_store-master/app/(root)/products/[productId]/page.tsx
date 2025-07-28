import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import type { Metadata } from "next";
import ProductDetailsClient from "./ProductDetailsClient";

interface ProductPageProps {
  params: { productId: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductDetails(params.productId);
    
    if (!product) {
      return {
        title: "Product Not Found - Borcella",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.title} - Borcella`,
      description: product.description || `Shop ${product.title} on Borcella. ${product.description?.substring(0, 150)}...`,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: `${product.title} - Borcella`,
        description: product.description || `Shop ${product.title} on Borcella.`,
        type: "website",
        url: `https://drapeanddime.shop/products/${params.productId}`,
        images: product.media && product.media.length > 0 ? [
          {
            url: product.media[0],
            width: 800,
            height: 600,
            alt: product.title,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.title} - Borcella`,
        description: product.description || `Shop ${product.title} on Borcella.`,
        images: product.media && product.media.length > 0 ? [product.media[0]] : [],
      },
      alternates: {
        canonical: `https://drapeanddime.shop/products/${params.productId}`,
      },
    };
  } catch (error) {
    return {
      title: "Product - Borcella",
      description: "Product details page",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, relatedProducts] = await Promise.all([
    getProductDetails(params.productId),
    getRelatedProducts(params.productId)
  ]);
  
  return (
    <ProductDetailsClient 
      productId={params.productId}
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
    />
  );
}
