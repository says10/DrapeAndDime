"use client"

import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import ProductInfo from "@/components/ProductInfo";
import ReviewsList from "@/components/ReviewsList";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { Package, Heart, Share2, ChevronRight, Home, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const router = useRouter();
  const { user } = useUser();
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, related] = await Promise.all([
          getProductDetails(params.productId),
          getRelatedProducts(params.productId)
        ]);
        setProductDetails(product);
        setRelatedProducts(related);
        
        // Check if product is in wishlist
        if (user) {
          const res = await fetch(`/api/users?userId=${user.id}`);
          const userData = await res.json();
          setIsInWishlist(userData.wishlist?.includes(params.productId) || false);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.productId, user]);

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId: params.productId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();
      setIsInWishlist(data.wishlist.includes(params.productId));
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleReviewSubmitted = () => {
    // This will be called when a new review is submitted
    // The ProductInfo component will automatically refresh its rating display
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
        <div className="text-center p-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 max-w-md mx-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 font-serif">Product Not Found</h2>
          <p className="text-gray-600 font-light">The product you're looking for doesn't exist or has been removed.</p>
          <a href="/products" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Home className="w-5 h-5" />
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 font-sans">
      {/* Product Details Section */}
      <section className="relative pt-20 sm:pt-24">
        {/* Premium Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-[1920px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="px-4 pt-4 pb-2 sm:px-8 sm:pt-8 sm:pb-4">
            <nav className="flex items-center text-xs sm:text-sm text-gray-500 max-w-7xl mx-auto font-light flex-wrap gap-1">
              <a href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </a>
              <ChevronRight className="w-4 h-4 mx-1 sm:mx-2" />
              <a href="/products" className="hover:text-gray-900 transition-colors">Products</a>
              <ChevronRight className="w-4 h-4 mx-1 sm:mx-2" />
              <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-[200px]">{productDetails.title}</span>
            </nav>
          </div>
          {/* Main Product Content */}
          <div className="py-4 sm:py-8 px-2 sm:px-8">
            <div className="w-full sm:max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-0 sm:p-8">
                  {/* Gallery Section */}
                  <div className="relative">
                    <div className="pt-4 sm:pt-8">
                      <Gallery productMedia={productDetails.media} />
                    </div>
                  </div>
                  {/* Product Info Section */}
                  <div className="relative">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Actions */}
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button 
                            onClick={handleWishlistToggle}
                            className={`p-2.5 rounded-xl transition-all ${
                              isInWishlist 
                                ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart 
                              className={`w-5 h-5 transition-all duration-200 ${
                                isInWishlist 
                                  ? "fill-red-500 text-red-500" 
                                  : "fill-transparent text-gray-400 hover:text-gray-600"
                              }`}
                            />
                          </button>
                          <button 
                            onClick={handleShare}
                            className={`p-2.5 rounded-xl transition-all relative ${
                              isShareCopied 
                                ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                            aria-label="Share product"
                          >
                            {isShareCopied ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Share2 className="w-5 h-5" />
                            )}
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
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="max-w-7xl mx-auto px-2 sm:px-8 py-6 sm:py-12">
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
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
              <ReviewsList 
                productId={params.productId} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Comment */}
      <div className="relative py-24 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-2xl font-light text-gray-600 italic tracking-wide font-serif">
            "Excellence in every thread, luxury in every detail. A perfect blend of style and sophistication."
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-8" />
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
