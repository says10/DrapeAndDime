"use client"

import Loader from "@/components/Loader"
import ProductCard from "@/components/ProductCard"
import { getProductDetails } from "@/lib/actions/actions"
import { useUser } from "@clerk/nextjs"
import { use, useEffect, useState } from "react"
import { Heart, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const Wishlist = () => {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null)
  const [wishlist, setWishlist] = useState<ProductType[]>([])

  const getUser = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/users?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`)
      }

      const data = await res.json()
      setSignedInUser(data)
    } catch (err) {
      console.error("[users_GET]", err)
      setError("Failed to load user data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isUserLoaded) {
      if (!user) {
        router.push("/sign-in")
        return
      }
      getUser()
    }
  }, [user, isUserLoaded, router])

  const getWishlistProducts = async () => {
    if (!signedInUser?.wishlist?.length) {
      setWishlist([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const wishlistProducts = await Promise.all(
        signedInUser.wishlist.map(async (productId) => {
          try {
            const product = await getProductDetails(productId)
            return product
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err)
            return null
          }
        })
      )

      const validProducts = wishlistProducts.filter((product): product is ProductType => product !== null)
      setWishlist(validProducts)
    } catch (err) {
      console.error("[wishlist_GET]", err)
      setError("Failed to load wishlist items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts()
    }
  }, [signedInUser])

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser)
  }

  if (!isUserLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50/50">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50/50">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 max-w-md mx-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-[1920px] mx-auto px-4 py-8 sm:px-8 sm:py-16">
          {/* Wishlist Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Wishlist
            </h1>
          </div>
          {/* Wishlist Count */}
          <div className="mb-6 sm:mb-8">
            <p className="text-gray-600 text-sm sm:text-base">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          {/* Products Grid */}
          {wishlist.length === 0 ? (
            <div className="text-center py-10 sm:py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
              <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Add items to your wishlist to save them for later
              </p>
              <button
                onClick={() => router.push('/products')}
                className="mt-6 sm:mt-8 px-4 py-2 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
              {wishlist.map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                  <ProductCard 
                    product={product} 
                    updateSignedInUser={updateSignedInUser}
                  />
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
export default Wishlist;