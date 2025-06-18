"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Star, TrendingUp } from "lucide-react";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const BestsellersPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);

  // Fetch bestsellers
  const fetchBestsellers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('sortBy', 'price'); // Sort by price as a proxy for popularity
      params.append('sortOrder', 'desc');
      params.append('limit', '20'); // Show more products for bestsellers

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        console.error('Failed to fetch bestsellers:', data.error);
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Best Sellers</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Our most popular and trending products
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product._id} className="relative">
                  {/* Bestseller Badge */}
                  {index < 4 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      #{index + 1} Best Seller
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bestsellers found</h3>
              <p className="text-gray-600">Check back later for our trending products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestsellersPage; 