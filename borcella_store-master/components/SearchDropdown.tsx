"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price: number;
  originalPrice: number;
  category: string;
}

interface SearchDropdownProps {
  query: string;
  isVisible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const SearchDropdown = ({ query, isVisible, onClose, onSelectProduct }: SearchDropdownProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/search/${encodeURIComponent(query)}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Failed to search products');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isVisible || !query.trim()) {
    return null;
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Search Results for "{query}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && query.length >= 2 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No products found for "{query}"
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="space-y-2">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {product.media && product.media[0] ? (
                    <Image
                      src={product.media[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-500 transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900">
                    ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <Search className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Link
              href={`/search/${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              View all results for "{query}"
              <Search className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown; 