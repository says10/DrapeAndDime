import Gallery from "@/components/Gallery"
import ProductCard from "@/components/ProductCard"
import ProductInfo from "@/components/ProductInfo"
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions"

const CarouselDetails = async ({ params }: { params: { productId: string }}) => {
  // Fetch product details and related products
  const productDetails = await getProductDetails(params.productId)
  const relatedProducts = await getRelatedProducts(params.productId)

  return (
    <>
      {/* Carousel Section */}
      <div className="flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        {/* Gallery to display product images */}
        <Gallery productMedia={productDetails.media} />
        {/* Product information */}
        <ProductInfo productInfo={productDetails} />
      </div>

      {/* Related Products Section */}
      <div className="flex flex-col items-center px-10 py-5 max-md:px-3">
        <p className="text-heading3-bold">Related Products</p>
        <div className="flex flex-wrap gap-16 mx-auto mt-8">
          {/* Display related products */}
          {relatedProducts?.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}

export const dynamic = "force-dynamic";

export default CarouselDetails;
