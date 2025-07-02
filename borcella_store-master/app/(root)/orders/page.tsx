"use client"

import { getOrders } from "@/lib/actions/actions"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loader"
import { AlertCircle, Package } from "lucide-react"

const Orders = () => {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isUserLoaded) return

      if (!user) {
        router.push("/sign-in")
        return
      }

      try {
        setLoading(true)
        setError(null)
        const fetchedOrders = await getOrders(user.id)
        fetchedOrders.sort((a: OrderType, b: OrderType) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setOrders(fetchedOrders)
      } catch (err) {
        console.error("[orders_GET]", err)
        setError("Failed to load orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, isUserLoaded, router])

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Your Orders</h1>
        
        {!orders || orders.length === 0 ? (
          <div className="text-center py-10 sm:py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
            <Package className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <button
              onClick={() => router.push("/home")}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order: OrderType) => (
              <div 
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 justify-between items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{order._id}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Status</p>
                    <p className={`text-sm sm:text-base font-semibold ${
                      order.status === "Shipped" ? "text-green-600" :
                      order.status === "Processing" ? "text-blue-600" :
                      order.status === "Delivered" ? "text-purple-600" :
                      "text-orange-600"
                    }`}>
                      {order.status || "NOT PAID"}
                    </p>
                  </div>
                </div>

                {order.status === "Shipped" && order.trackingLink && (
                  <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Tracking Link</p>
                    <a
                      href={order.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-base text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {order.trackingLink}
                    </a>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  {order.products.map((orderItem: OrderItemType) => (
                    <div 
                      key={orderItem._id}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-3 sm:p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Image
                        src={orderItem.product.media[0] || "/placeholder.jpg"}
                        alt={orderItem.product.title}
                        width={96}
                        height={96}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Product</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">{orderItem.product.title}</p>
                        </div>
                        {orderItem.color && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Color</p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">{orderItem.color}</p>
                          </div>
                        )}
                        {orderItem.size && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">Size</p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">{orderItem.size}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Unit Price</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">₹{orderItem.product.price}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Quantity</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">{orderItem.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
