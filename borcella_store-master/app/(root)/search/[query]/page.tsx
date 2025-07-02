import ProductCard from '@/components/ProductCard'
import { getSearchedProducts } from '@/lib/actions/actions'
import { Search } from 'lucide-react'

const SearchPage = async ({ params }: { params: { query: string }}) => {
  const searchedProducts = await getSearchedProducts(params.query)
  const decodedQuery = decodeURIComponent(params.query)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto px-4 py-8 sm:px-8 sm:py-16">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <Search className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Search Results for "{decodedQuery}"
              </h1>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-8">
            <p className="text-gray-600 text-sm sm:text-base">
              {searchedProducts?.length || 0} {searchedProducts?.length === 1 ? 'result' : 'results'} found
            </p>
          </div>

          {/* Products Grid */}
          {!searchedProducts || searchedProducts.length === 0 ? (
            <div className="text-center py-10 sm:py-16">
              <p className="text-gray-500 font-medium tracking-wide">
                No products found matching "{decodedQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {searchedProducts.map((product: ProductType) => (
                <div key={product._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic";
export default SearchPage;