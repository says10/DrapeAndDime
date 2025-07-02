"use client";
import { useRef } from "react";
import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";

const CarouselDetailsClient = ({ productDetails, relatedProducts }: { productDetails: any, relatedProducts: any[] }) => {
  const productImageRef = useRef(null);
  return (
    <>
      {/* Carousel Section */}
      <div className="flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
        {/* Gallery to display product images */}
        <Gallery productMedia={productDetails.media} />
        {/* Product information */}
        <ProductInfo productInfo={productDetails} productImageRef={productImageRef} triggerFlyToCart={() => {}} />
      </div>
      {/* Related Products Section */}
      <div className="flex flex-col items-center px-10 py-5 max-md:px-3">
        <p className="text-heading3-bold">Related Products</p>
        <div className="flex flex-wrap gap-16 mx-auto mt-8">
          {/* Display related products */}
          {relatedProducts?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CarouselDetailsClient; 