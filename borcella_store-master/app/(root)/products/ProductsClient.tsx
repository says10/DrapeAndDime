"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Filter, SortAsc, SortDesc, Search, X } from "lucide-react";

interface ProductsClientProps {
  initialProducts: ProductType[];
}

const ProductsClient = ({ initialProducts }: ProductsClientProps) => {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Add filter state for brand, collection, gender
  const [selectedBrandTags, setSelectedBrandTags] = useState<string[]>([]);
  const [selectedCollectionTags, setSelectedCollectionTags] = useState<string[]>([]);
  const [selectedGenderTags, setSelectedGenderTags] = useState<string[]>([]);
  const [selectedSizeTags, setSelectedSizeTags] = useState<string[]>([]);

  // Available filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [brandTags, setBrandTags] = useState<string[]>([]);
  const [collectionTags, setCollectionTags] = useState<string[]>([]);
  const [genderTags, setGenderTags] = useState<string[]>([]);
  const [sizeTags, setSizeTags] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  useEffect(() => {
    // Extract filter options from products
    if (products && products.length > 0) {
      const uniqueCategories = [...new Set(products.map((p: ProductType) => p.category).filter(Boolean))] as string[];
      const allTags = products.flatMap((p: ProductType) => (p.tags || []).map((t: string) => t.trim())).filter(Boolean);
      const uniqueTags = [...new Set(allTags)] as string[];
      // Brand, Collection, Gender, Size tags by prefix
      setBrandTags(uniqueTags.filter(tag => tag.startsWith('*')));
      setCollectionTags(uniqueTags.filter(tag => tag.startsWith('#')));
      setGenderTags(uniqueTags.filter(tag => tag.startsWith('%')));
      setSizeTags(uniqueTags.filter(tag => tag.startsWith('$')));
      setTags(uniqueTags.filter(tag => !tag.startsWith('*') && !tag.startsWith('#') && !tag.startsWith('%') && !tag.startsWith('$')));
      
      const allSizes = new Set<string>();
      const allColors = new Set<string>();
      
      products.forEach((product: ProductType) => {
        if (product.sizes) {
          const sizes = product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
          sizes.forEach((size: string) => allSizes.add(size));
        }
        if (product.colors) {
          const colors = product.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
          colors.forEach((color: string) => allColors.add(color));
        }
      });
      
      setCategories(uniqueCategories);
      setSizes(Array.from(allSizes));
      setColors(Array.from(allColors));
    }
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedTags.some(tag => product.tags.includes(tag))
      );
    }

    // Brand tag filters
    if (selectedBrandTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedBrandTags.some(tag => product.tags.includes(tag))
      );
    }

    // Collection tag filters
    if (selectedCollectionTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedCollectionTags.some(tag => product.tags.includes(tag))
      );
    }

    // Gender tag filters
    if (selectedGenderTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedGenderTags.some(tag => product.tags.includes(tag))
      );
    }

    // Size tag filters
    if (selectedSizeTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedSizeTags.some(tag => product.tags.includes(tag))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && selectedSizes.some(size => 
          product.sizes.split(',').map(s => s.trim()).includes(size)
        )
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && selectedColors.some(color => 
          product.colors.split(',').map(c => c.trim()).includes(color)
        )
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedTags, selectedBrandTags, selectedCollectionTags, selectedGenderTags, selectedSizeTags, selectedSizes, selectedColors, priceRange, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSelectedBrandTags([]);
    setSelectedCollectionTags([]);
    setSelectedGenderTags([]);
    setSelectedSizeTags([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: '', max: '' });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleBrandTag = (tag: string) => {
    setSelectedBrandTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCollectionTag = (tag: string) => {
    setSelectedCollectionTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleGenderTag = (tag: string) => {
    setSelectedGenderTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleSizeTag = (tag: string) => {
    setSelectedSizeTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || selectedBrandTags.length > 0 || selectedCollectionTags.length > 0 || selectedGenderTags.length > 0 || selectedSizeTags.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange.min || priceRange.max;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Latest</option>
                <option value="title">Name</option>
                <option value="price">Price</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Dropdown */}
          {filterDropdownOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand Tags */}
                {brandTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Brands</h3>
                    <div className="flex flex-wrap gap-1">
                      {brandTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleBrandTag(tag)}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedBrandTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {tag.replace('*', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collection Tags */}
                {collectionTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Collections</h3>
                    <div className="flex flex-wrap gap-1">
                      {collectionTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleCollectionTag(tag)}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedCollectionTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {tag.replace('#', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gender Tags */}
                {genderTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Gender</h3>
                    <div className="flex flex-wrap gap-1">
                      {genderTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleGenderTag(tag)}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedGenderTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {tag.replace('%', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Tags */}
                {sizeTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-1">
                      {sizeTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleSizeTag(tag)}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedSizeTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {tag.replace('$', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsClient; 