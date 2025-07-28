"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface CollectionsClientProps {
  collections: CollectionType[];
}

const CollectionsClient = ({ collections }: CollectionsClientProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections, each designed to bring you the latest trends and timeless classics.
          </p>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/collections/${collection._id}`)}
              >
                <div className="relative h-64">
                  <Image
                    src={collection.image || "/placeholder-collection.jpg"}
                    alt={collection.title || "Collection"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {collection.description || "Explore this curated collection of amazing products."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {collection.products?.length || 0} products
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View Collection →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No collections available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsClient; 