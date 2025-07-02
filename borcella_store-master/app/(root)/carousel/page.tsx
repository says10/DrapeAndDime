import CarouselDetailsClient from "@/components/CarouselDetailsClient";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";

const CarouselDetails = async ({ params }: { params: { productId: string }}) => {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  return (
    <CarouselDetailsClient productDetails={productDetails} relatedProducts={relatedProducts} />
  );
};

export const dynamic = "force-dynamic";

export default CarouselDetails;
