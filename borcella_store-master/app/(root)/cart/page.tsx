"use client";

import useCart from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Temporary user state until auth is implemented
const useAuth = () => {
  return { 
    isAuthenticated: false,
    user: {
      id: null,
      email: null,
      name: null
    }
  };
};

const Cart = () => {
  const router = useRouter();
  const { user } = useAuth();
  const cart = useCart();
  const [stockValidation, setStockValidation] = useState<{ [key: string]: boolean }>({});

  // Calculate total
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.email,
    name: user?.name,
  };

  // Validate stock when cart items change
  useEffect(() => {
    const checkStock = async () => {
      try {
        const formattedCartItems = cart.cartItems.map((cartItem) => ({
          itemId: cartItem.item._id,
          quantity: cartItem.quantity,
          color: cartItem.color,
          size: cartItem.size,
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validatestock`, {
          method: "POST",
          body: JSON.stringify({ cartItems: formattedCartItems }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setStockValidation(data);
      } catch (err) {
        console.error("[validateStock] Error:", err);
      }
    };

    if (cart.cartItems.length > 0) {
      checkStock();
    }
  }, [cart.cartItems]);

  const handleCheckout = async () => {
    try {
      // Ensure that there are no out-of-stock items before redirecting
      if (Object.values(stockValidation).includes(false)) {
        // Show some error or alert for out-of-stock items
        alert("Some items are out of stock and cannot be purchased.");
        return;
      }
      
      // Proceed to checkout if all items are in stock
      if (!user) {
        router.push("sign-in");
      } else {
        // This now redirects directly to the checkout page
        const checkoutUrl =  `https://drapeanddime.shop/payment`;
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  // Handle quantity increase and decrease
  const handleIncreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity < cartItem.item.quantity) {
      cart.increaseQuantity(cartItem.item._id);
    }
  };

  const handleDecreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity > 1) {
      cart.decreaseQuantity(cartItem.item._id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto px-8 py-16">
          <div className="flex gap-16 max-lg:flex-col">
            {/* Cart Items Section */}
            <div className="w-2/3 max-lg:w-full">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="w-6 h-6" />
                <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
              </div>

              {cart.cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 font-medium tracking-wide">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((cartItem) => {
                    const isOutOfStock = stockValidation[cartItem.item._id] === false;

                    return (
                      <div
                        key={cartItem.item._id}
                        className={`group relative flex items-center gap-6 p-6 rounded-lg transition-all duration-300 ${
                          isOutOfStock 
                            ? "bg-red-50/50 border border-red-200" 
                            : "bg-white border border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src={cartItem.item.media[0]}
                            fill
                            className="rounded-lg object-cover"
                            alt={cartItem.item.title}
                          />
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">{cartItem.item.title}</h3>
                              <div className="flex gap-4 text-sm text-gray-600">
                                {cartItem.color && (
                                  <span className="capitalize">{cartItem.color}</span>
                                )}
                                {cartItem.size && (
                                  <span className="capitalize">{cartItem.size}</span>
                                )}
                              </div>
                              <p className="text-lg font-semibold">₹{cartItem.item.price}</p>
                              {isOutOfStock && (
                                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                              )}
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleDecreaseQuantity(cartItem)}
                                  className="p-1 hover:text-red-600 transition-colors"
                                >
                                  <MinusCircle className="w-5 h-5" />
                                </button>
                                <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                                <button
                                  onClick={() => handleIncreaseQuantity(cartItem)}
                                  className="p-1 hover:text-red-600 transition-colors"
                                >
                                  <PlusCircle className="w-5 h-5" />
                                </button>
                              </div>

                              <button
                                onClick={() => cart.removeItem(cartItem.item._id)}
                                className="p-2 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="w-1/3 max-lg:w-full">
              <div className="sticky top-8 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
                <h2 className="text-xl font-semibold pb-4 border-b">
                  Order Summary
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    {cart.cartItems.length} {cart.cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold">₹{totalRounded}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={Object.values(stockValidation).includes(false)}
                  className={`w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                    Object.values(stockValidation).includes(false)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-900'
                  }`}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
