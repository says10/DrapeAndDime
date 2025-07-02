"use client";
export const dynamic = "force-dynamic";

import useCart from "@/lib/hooks/useCart";
import { useCartWithUser } from "@/lib/hooks/useCart";
import { MinusCircle, PlusCircle, Trash, ShoppingBag, ArrowRight, AlertTriangle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import HydrationSafe from "@/components/HydrationSafe";

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
  const cart = useCartWithUser();
  const [stockValidation, setStockValidation] = useState<{ [key: string]: boolean }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      if (cart.cartItems.length === 0) {
        setStockValidation({});
        setValidationErrors([]);
        return;
      }

      setIsValidating(true);
      setValidationErrors([]);
      
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
        
        if (!res.ok) {
          throw new Error('Failed to validate stock');
        }
        
        const data = await res.json();
        setStockValidation(data);
        
        // Check for out-of-stock items
        const outOfStockItems = cart.cartItems.filter(
          item => data[item.item._id] === false
        );
        
        if (outOfStockItems.length > 0) {
          const errorMessages = outOfStockItems.map(item => 
            `${item.item.title} is out of stock`
          );
          setValidationErrors(errorMessages);
          
          // Show toast for out-of-stock items
          toast.error("Some items in your cart are out of stock", {
            description: "Please remove out-of-stock items to proceed with checkout."
          });
        }
      } catch (err) {
        console.error("[validateStock] Error:", err);
        toast.error("Failed to validate stock. Please refresh and try again.");
      } finally {
        setIsValidating(false);
      }
    };

    checkStock();
  }, [cart.cartItems]);

  const handleCheckout = async () => {
    // Check if cart is empty
    if (cart.cartItems.length === 0) {
      toast.error("Your cart is empty", {
        description: "Please add items to your cart before proceeding to checkout."
      });
      return;
    }

    // Check for out-of-stock items
    const hasOutOfStockItems = Object.values(stockValidation).includes(false);
    if (hasOutOfStockItems) {
      toast.error("Cannot proceed to checkout", {
        description: "Some items in your cart are out of stock. Please remove them first."
      });
      return;
    }

    // Check if still validating
    if (isValidating) {
      toast.error("Please wait", {
        description: "We're still validating your cart items."
      });
      return;
    }

    try {
      // Proceed to checkout if all validations pass
      if (!user) {
        router.push("sign-in");
      } else {
        // This now redirects directly to the checkout page
        const checkoutUrl = `https://drapeanddime.shop/payment`;
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
      toast.error("Checkout failed", {
        description: "Please try again later."
      });
    }
  };

  // Handle quantity increase and decrease
  const handleIncreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity < cartItem.item.quantity) {
      cart.increaseQuantity(cartItem.item._id);
    } else {
      toast.error("Maximum quantity reached", {
        description: `Only ${cartItem.item.quantity} items available in stock.`
      });
    }
  };

  const handleDecreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity > 1) {
      cart.decreaseQuantity(cartItem.item._id);
    }
  };

  // Remove out-of-stock items
  const removeOutOfStockItems = () => {
    const outOfStockItems = cart.cartItems.filter(
      item => stockValidation[item.item._id] === false
    );
    
    outOfStockItems.forEach(item => {
      cart.removeItem(item.item._id);
    });
    
    toast.success("Out-of-stock items removed", {
      description: `${outOfStockItems.length} item(s) removed from cart.`
    });
  };

  return (
    <HydrationSafe fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative max-w-[1920px] mx-auto px-4 py-8 sm:px-8 sm:py-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-16">
              {/* Cart Items Section */}
              <div className="w-full lg:w-2/3">
                <div className="flex items-center gap-2 mb-6 sm:gap-3 sm:mb-8">
                  <ShoppingBag className="w-6 h-6" />
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shopping Cart</h1>
                </div>

                {/* Validation Warnings */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800 mb-2">Items Out of Stock</h3>
                        <ul className="space-y-1 mb-3">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm text-red-700">• {error}</li>
                          ))}
                        </ul>
                        <button
                          onClick={removeOutOfStockItems}
                          className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                        >
                          Remove all out-of-stock items
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {cart.cartItems.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-100">
                    <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started!</p>
                    <button
                      onClick={() => router.push('/home')}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.cartItems.map((cartItem) => {
                      const isOutOfStock = stockValidation[cartItem.item._id] === false;
                      return (
                        <div
                          key={cartItem.item._id}
                          className={`group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg transition-all duration-300 ${
                            isOutOfStock 
                              ? "bg-red-50/50 border border-red-200" 
                              : "bg-white border border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 mb-2 sm:mb-0">
                            <Image
                              src={cartItem.item.media && cartItem.item.media.length > 0 && cartItem.item.media[0] ? cartItem.item.media[0] : "/logo.png"}
                              fill
                              className="rounded-lg object-cover"
                              alt={cartItem.item.title}
                            />
                          </div>
                          <div className="flex-grow w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                              <div className="space-y-1 sm:space-y-2">
                                <h3 className="text-base sm:text-lg font-medium">{cartItem.item.title}</h3>
                                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                  {cartItem.color && (
                                    <span className="capitalize">{cartItem.color}</span>
                                  )}
                                  {cartItem.size && (
                                    <span className="capitalize">{cartItem.size}</span>
                                  )}
                                </div>
                                <p className="text-base sm:text-lg font-semibold">₹{cartItem.item.price}</p>
                                {isOutOfStock && (
                                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600 font-medium">
                                    <AlertCircle className="w-4 h-4" />
                                    Out of Stock
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-0">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <button
                                    onClick={() => handleDecreaseQuantity(cartItem)}
                                    disabled={isOutOfStock}
                                    className={`p-1 transition-colors ${
                                      isOutOfStock 
                                        ? "text-gray-300 cursor-not-allowed" 
                                        : "hover:text-red-600"
                                    }`}
                                  >
                                    <MinusCircle className="w-5 h-5" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                                  <button
                                    onClick={() => handleIncreaseQuantity(cartItem)}
                                    disabled={isOutOfStock}
                                    className={`p-1 transition-colors ${
                                      isOutOfStock 
                                        ? "text-gray-300 cursor-not-allowed" 
                                        : "hover:text-red-600"
                                    }`}
                                  >
                                    <PlusCircle className="w-5 h-5" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => cart.removeItem(cartItem.item._id)}
                                  className="p-2 hover:text-red-600 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
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
              <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold pb-2 sm:pb-4 border-b">
                    Order Summary
                    <span className="block text-xs sm:text-sm font-normal text-gray-500 mt-1">
                      {cart.cartItems.length} {cart.cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </h2>

                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold">₹{totalRounded}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={
                      cart.cartItems.length === 0 || 
                      Object.values(stockValidation).includes(false) || 
                      isValidating
                    }
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                      cart.cartItems.length === 0 || 
                      Object.values(stockValidation).includes(false) || 
                      isValidating
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-900'
                    }`}
                  >
                    {isValidating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Additional warnings */}
                  {cart.cartItems.length === 0 && (
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      Add items to your cart to proceed
                    </p>
                  )}
                  
                  {Object.values(stockValidation).includes(false) && (
                    <p className="text-xs sm:text-sm text-red-600 text-center">
                      Remove out-of-stock items to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HydrationSafe>
  );
};

export default Cart;
