"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import auth hook from Clerk
import Image from "next/image";
import { CreditCard, Package, ShoppingBag, AlertCircle } from "lucide-react";

// Import the custom useCart hook
import useCart from "@/lib/hooks/useCart"; // Adjust the path to where your store is located
import { load } from '@cashfreepayments/cashfree-js'; // Import Cashfree SDK

const Payment = () => {
  const router = useRouter();
  const { cartItems } = useCart(); // Use cartItems from your Zustand store

  const { user } = useUser(); // Get clerkId from Clerk
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    clerkId: user?.id || "", // Initialize with clerkId from Clerk
  });

  const [shippingRate, setShippingRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages

  const amount = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  // Initialize Cashfree SDK when the component mounts
  useEffect(() => {
    const initializeCashfreeSDK = async () => {
      try {
        await load({
          mode: "production", // Use "production" for live mode
        });
        setCashfreeLoaded(true);
      } catch (error) {
        console.error("Error loading Cashfree SDK:", error);
        setErrorMessage("Failed to load Cashfree payment gateway.");
      }
    };
    
    initializeCashfreeSDK();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function
  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      setErrorMessage("All fields are required.");
      return false;
    }

    // Phone number validation (simple validation for now)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Postal code validation (simple 6-digit validation)
    const postalCodeRegex = /^[0-9]{6}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      setErrorMessage("Please enter a valid 6-digit postal code.");
      return false;
    }

    setErrorMessage(""); // Clear error message if validation passes
    return true;
  };

  const handlePayment = async () => {
    if (!cashfreeLoaded || !amount) return;

    // Validate form data
    if (!validateForm()) return;

    const orderData = {
      cartItems,
      customer: {
        email: formData.email,
        clerkId: user?.id, // Ensure this is populated
      },
      shippingDetails: formData,
      shippingRate,
      enteredName: formData.name,
    };

    console.log("Sending orderData to API:", JSON.stringify(orderData, null, 2)); // Log before sending request

    try {
      const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        console.error("Checkout API error response:", errorData); // Log error details
        setErrorMessage(errorData.message || "Some of the items may be out of stock");
        return;
      }

      const checkoutData = await checkoutResponse.json();
      console.log("Received checkout response:", checkoutData); // Log response data

      if (!checkoutData.paymentSessionId) {
        setErrorMessage("Payment session ID missing. Please try again.");
        return;
      }
      let checkoutOptions = {
          paymentSessionId: checkoutData.paymentSessionId,
          redirectTarget: "_modal",
      };

      // Proceed with payment
      const cashfree = await load({ mode: "production" });
      cashfree
        .checkout(checkoutOptions)
        .then(async (response: { paymentId: string }) => {
          console.log("Cashfree Payment Success:", response);
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifypayment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: checkoutData.orderId,
              paymentId: checkoutData.paymentId,
              shippingDetails: formData,
            }),
          });

          const verifyResData = await verifyRes.json();
          console.log("Payment Verification Response:", verifyResData);

          if (verifyResData.success) {
            window.location.href = "/payment_success";
          } else {
            setErrorMessage("Payment verification failed.");
            window.location.href = "/payment_fail";
          }
        })
        .catch((error: any) => {
          console.error("Cashfree payment error:", error);
          setErrorMessage("Payment failed. Please try again.");
        });
    } catch (error) {
      console.error("Error during checkout process:", error);
      setErrorMessage("An error occurred during checkout. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="relative">
        {/* Premium Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-[1920px] mx-auto px-8 py-16">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Complete Your Purchase</h1>
            <p className="text-gray-600">Please provide your shipping details to proceed with the payment</p>
          </div>

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Shipping Form */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <Package className="w-6 h-6 text-gray-800" />
                  <h2 className="text-2xl font-semibold text-gray-800">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Enter street address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Enter postal code"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Enter country"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <ShoppingBag className="w-6 h-6 text-gray-800" />
                  <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>
                </div>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem.item._id} className="flex gap-6 p-4 bg-gray-50/50 rounded-xl">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={cartItem.item.media[0]}
                          fill
                          className="object-cover rounded-lg"
                          alt={cartItem.item.title}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{cartItem.item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cartItem.item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">Qty: {cartItem.quantity}</p>
                          <p className="font-medium text-gray-900">₹{cartItem.item.price * cartItem.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-12 max-w-2xl mx-auto">
              <button
                onClick={handlePayment}
                className="w-full py-4 px-8 bg-gray-900 text-white font-medium rounded-xl shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Payment</span>
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment powered by Cashfree
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Payment;
