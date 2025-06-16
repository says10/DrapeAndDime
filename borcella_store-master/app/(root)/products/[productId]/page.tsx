import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { Package, Heart, Share2 } from "lucide-react";

const ProductDetails = async ({ params }: { params: { productId: string } }) => {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  if (!productDetails) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50/50">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Product not found</p>
          <p className="text-gray-500 mt-2">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Product Details Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50/50">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto">
          <div className="px-8 py-16">
            {/* Breadcrumb */}
            <div className="mb-8">
              <nav className="flex text-sm text-gray-500">
                <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
                <span className="mx-2">/</span>
                <a href="/products" className="hover:text-gray-900 transition-colors">Products</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{productDetails.title}</span>
              </nav>
            </div>

            <div className="flex justify-center items-start gap-16 py-10 max-md:flex-col max-md:items-center">
              {/* Gallery Section */}
              <div className="flex-1 max-w-2xl w-full">
                <Gallery productMedia={productDetails.media} />
              </div>

              {/* Product Info Section */}
              <div className="flex-1 max-w-xl w-full">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      productDetails.isAvailable 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {productDetails.isAvailable ? "In Stock" : "Out of Stock"}
                      <span className="ml-2">{productDetails.isAvailable ? "✓" : "×"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <ProductInfo productInfo={productDetails} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="relative bg-gradient-to-b from-gray-50/50 to-white">
        {/* Decorative Separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto">
          <div className="px-8 py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">You May Also Like</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gray-200 via-gray-900 to-gray-200 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedProducts?.length > 0 ? (
                relatedProducts.map((product: ProductType) => (
                  <div key={product._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white/50 rounded-xl border border-gray-100">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No similar products available at the moment</p>
                  <p className="text-gray-500 mt-2">Check back later for new arrivals</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const dynamic = "force-dynamic";
export default ProductDetails;
