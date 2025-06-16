import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";

const ProductDetails = async ({ params }: { params: { productId: string } }) => {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  if (!productDetails) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">Product not found</p>
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
            <div className="flex justify-center items-start gap-16 py-10 max-md:flex-col max-md:items-center">
              <Gallery productMedia={productDetails.media} />
              <div className="flex flex-col space-y-6">
                <ProductInfo productInfo={productDetails} />
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  productDetails.isAvailable 
                    ? "bg-green-50 text-green-700" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {productDetails.isAvailable ? "In Stock" : "Out of Stock"}
                  <span className="ml-2">{productDetails.isAvailable ? "✓" : "×"}</span>
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
              <div className="w-24 h-1 bg-black mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedProducts?.length > 0 ? (
                relatedProducts.map((product: ProductType) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 font-medium">No similar products available at the moment</p>
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
