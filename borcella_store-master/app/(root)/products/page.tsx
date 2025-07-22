"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/actions/actions";
import { Filter, SortAsc, SortDesc, Search, X } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData || []);
        
        // Extract filter options from products
        if (productsData && productsData.length > 0) {
          const uniqueCategories = [...new Set(productsData.map((p: ProductType) => p.category).filter(Boolean))] as string[];
          const allTags = productsData.flatMap((p: ProductType) => (p.tags || []).map((t: string) => t.trim())).filter(Boolean);
          const uniqueTags = [...new Set(allTags)] as string[];
          // Brand, Collection, Gender, Size tags by prefix
          setBrandTags(uniqueTags.filter(tag => tag.startsWith('*')));
          setCollectionTags(uniqueTags.filter(tag => tag.startsWith('#')));
          setGenderTags(uniqueTags.filter(tag => tag.startsWith('%')));
          setSizeTags(uniqueTags.filter(tag => tag.startsWith('$')));
          setTags(uniqueTags.filter(tag => !tag.startsWith('*') && !tag.startsWith('#') && !tag.startsWith('%') && !tag.startsWith('$')));
          
          const allSizes = new Set<string>();
          const allColors = new Set<string>();
          
          productsData.forEach((product: ProductType) => {
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
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedTags.some(tag => product.tags.includes(tag))
      );
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && selectedSizes.some(size => 
          product.sizes.toLowerCase().includes(size.toLowerCase())
        )
      );
    }

    // Colors filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && selectedColors.some(color => 
          product.colors.toLowerCase().includes(color.toLowerCase())
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

    // Brand tag filter
    if (selectedBrandTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedBrandTags.some(tag => product.tags.includes(tag))
      );
    }
    // Collection tag filter
    if (selectedCollectionTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedCollectionTags.some(tag => product.tags.includes(tag))
      );
    }
    // Gender tag filter
    if (selectedGenderTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedGenderTags.some(tag => product.tags.includes(tag))
      );
    }
    // Size tag filter
    if (selectedSizeTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && selectedSizeTags.some(tag => product.tags.includes(tag))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedTags, selectedSizes, selectedColors, priceRange, sortBy, sortOrder, selectedBrandTags, selectedCollectionTags, selectedGenderTags, selectedSizeTags]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('createdAt');
    setSortOrder('desc');
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

  // Add toggle functions for new filters
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">All Products</h1>
            <p className="text-gray-600 text-sm sm:text-base">Browse our latest products</p>
          </div>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="inline-block w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        {/* Filters - show as sidebar on desktop, drawer on mobile */}
        <div className={`mb-6 sm:mb-8${showFilters ? '' : ' hidden'}`}> {/* Responsive filter visibility */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {/* Brand Filter */}
            {brandTags.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Brand</div>
                <div className="flex flex-wrap gap-2">
                  {brandTags.map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full border text-sm ${selectedBrandTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                      onClick={() => toggleBrandTag(tag)}
                    >
                      {tag.replace('*', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Collection Filter */}
            {collectionTags.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Collection</div>
                <div className="flex flex-wrap gap-2">
                  {collectionTags.map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full border text-sm ${selectedCollectionTags.includes(tag) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                      onClick={() => toggleCollectionTag(tag)}
                    >
                      {tag.replace('#', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Gender Filter */}
            {genderTags.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Gender</div>
                <div className="flex flex-wrap gap-2">
                  {genderTags.map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full border text-sm ${selectedGenderTags.includes(tag) ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}
                      onClick={() => toggleGenderTag(tag)}
                    >
                      {tag.replace('%', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Size Filter */}
            {sizeTags.length > 0 && (
              <div>
                <div className="font-semibold mb-2">Size</div>
                <div className="flex flex-wrap gap-2">
                  {sizeTags.map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full border text-sm ${selectedSizeTags.includes(tag) ? 'bg-yellow-600 text-white border-yellow-600' : 'bg-white text-gray-700 border-gray-300'}`}
                      onClick={() => toggleSizeTag(tag)}
                    >
                      {tag.replace('$', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            >
              <option value="createdAt">Latest</option>
              <option value="price">Price</option>
              <option value="title">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
              onClick={clearFilters}
            className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent flex items-center gap-2"
          >
              <X className="w-5 h-5" />
                  Clear all
                </button>
              </div>
              </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="transform transition-all duration-300 hover:scale-[1.02]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 