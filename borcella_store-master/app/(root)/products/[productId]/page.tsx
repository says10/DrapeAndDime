import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";

const ProductDetails = async ({ params }: { params: { productId: string } }) => {
  // Fetch product details and related products
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  if (!productDetails) {
    return <p className="text-red-600 text-center text-lg">Product not found</p>;
  }

  return (
    <>
      {/* Product Gallery and Info */}
      <div className="flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        <Gallery productMedia={productDetails.media} />
        <div className="flex flex-col">
          <ProductInfo productInfo={productDetails} />
          
          {/* Display Availability Status */}
          <p className={`text-lg font-semibold mt-3 ${productDetails.isAvailable ? "text-green-600" : "text-red-600"}`}>
            {productDetails.isAvailable ? "In Stock ✅" : "Out of Stock ❌"}
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products-container flex flex-col items-center px-10 py-5 max-md:px-3">
        <p className="text-heading3-bold">Related Products</p>
        <div className="flex flex-wrap gap-16 mx-auto mt-8">
          {relatedProducts?.length > 0 ? (
            relatedProducts.map((product: ProductType) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No related products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export const dynamic = "force-dynamic";

export default ProductDetails;
