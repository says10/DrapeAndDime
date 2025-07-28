import { NextRequest } from "next/server";

// IMPORTANT:
// We fetch product and collection data from the admin API (not the public store),
// but we always generate sitemap URLs using the public store domain.
// This ensures Google indexes the correct URLs for your store, not the admin backend.

async function getAllProductSlugs() {
  try {
    // Fetch product data from the admin API
    const res = await fetch(`https://drape-and-dime.vercel.app/api/products`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    const products = await res.json();
    return products.map((product: any) => product._id);
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

async function getAllCollectionIds() {
  try {
    // Fetch collection data from the admin API
    const res = await fetch(`https://drape-and-dime.vercel.app/api/collections`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    const collections = await res.json();
    return collections.map((collection: any) => collection._id);
  } catch (error) {
    console.error("Error fetching collections for sitemap:", error);
    return [];
  }
}

export async function GET() {
  // Always use the public store domain for sitemap URLs
  const baseUrl = "https://drapeanddime.shop";
  
  // Get all product and collection IDs
  const productIds = await getAllProductSlugs();
  const collectionIds = await getAllCollectionIds();

  // Static pages
  const staticPages = [
    "",
    "/products",
    "/collections",
    "/cart",
    "/sign-in",
    "/sign-up",
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`).join("")}
  
  <!-- Product Pages -->
  ${productIds.map((id: string) => `
  <url>
    <loc>${baseUrl}/products/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  
  <!-- Collection Pages -->
  ${collectionIds.map((id: string) => `
  <url>
    <loc>${baseUrl}/collections/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
} 