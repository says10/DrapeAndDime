import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { Package, Heart, Share2, ChevronRight, Home, Star, MessageCircle } from "lucide-react";

const ProductDetails = async ({ params }: { params: { productId: string } }) => {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  if (!productDetails) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
        <div className="text-center p-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 max-w-md mx-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <a href="/products" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Home className="w-5 h-5" />
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      {/* Product Details Section */}
      <section className="relative pt-24">
        {/* Premium Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="px-8 pt-8 pb-4">
            <nav className="flex items-center text-sm text-gray-500 max-w-7xl mx-auto">
              <a href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </a>
              <ChevronRight className="w-4 h-4 mx-2" />
              <a href="/products" className="hover:text-gray-900 transition-colors">Products</a>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{productDetails.title}</span>
            </nav>
          </div>

          {/* Main Product Content */}
          <div className="px-8 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Gallery Section */}
                  <div className="relative">
                    <div className="sticky top-8">
                      <Gallery productMedia={productDetails.media} />
                    </div>
                  </div>

                  {/* Product Info Section */}
                  <div className="relative">
                    <div className="space-y-6">
                      {/* Stock Status & Actions */}
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          productDetails.isAvailable 
                            ? "bg-green-50 text-green-700 ring-1 ring-green-100" 
                            : "bg-red-50 text-red-700 ring-1 ring-red-100"
                        }`}>
                          {productDetails.isAvailable ? "In Stock" : "Out of Stock"}
                          <span className="ml-2">{productDetails.isAvailable ? "✓" : "×"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                            <Heart className="w-5 h-5" />
                          </button>
                          <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <ProductInfo productInfo={productDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="relative bg-gradient-to-b from-gray-50/50 to-white pt-24">
        {/* Decorative Separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        {/* Premium Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto">
          <div className="px-8 py-16">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  You May Also Like
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-gray-200 via-gray-900 to-gray-200 mx-auto rounded-full" />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {relatedProducts?.length > 0 ? (
                  relatedProducts.map((product: ProductType) => (
                    <div key={product._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Similar Products</h3>
                    <p className="text-gray-600">Check back later for new arrivals that match your style</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Comment */}
      <div className="relative py-24 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-2xl font-light text-gray-600 italic tracking-wide">
            "Excellence in every thread, luxury in every detail. A perfect blend of style and sophistication."
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-8" />
        </div>
      </div>
    </main>
  );
};

export const dynamic = "force-dynamic";
export default ProductDetails;
