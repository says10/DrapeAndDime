"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import auth hook from Clerk
import Image from "next/image";
import { CreditCard, Package, ShoppingBag, AlertCircle, Truck, XCircle, Loader2, CheckCircle } from "lucide-react";

// Import the custom useCart hook
import { useCartWithUser } from "@/lib/hooks/useCart"; // Adjust the path to where your store is located
import { load } from '@cashfreepayments/cashfree-js'; // Import Cashfree SDK
import { getOrders } from "@/lib/actions/actions";

// Add this at the top of the file, after imports
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

const Payment = () => {
  const router = useRouter();
  const { cartItems, clearCart, ...cartActions } = useCartWithUser(); // Use cartItems from your Zustand store

  const { user } = useUser(); // Get clerkId from Clerk
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'verifying' | 'complete'>('form');
  const [retryCount, setRetryCount] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

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
  const [errorMessage, setErrorMessage] = useState("");
  const [showCodMessage, setShowCodMessage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isFormFilled, setIsFormFilled] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponList, setCouponList] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [modalError, setModalError] = useState("");

  const [userOrderCount, setUserOrderCount] = useState<number | null>(null);

  const amount = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  // Calculate discounted amount
  const discountedAmount = discountAmount > 0 ? amount - discountAmount : amount;

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

  // Fetch coupons from backend
  useEffect(() => {
    setLoadingCoupons(true);
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        setCouponList(data);
        setLoadingCoupons(false);
      })
      .catch(() => setLoadingCoupons(false));
  }, []);

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (user?.id) {
        try {
          const orders = await getOrders(user.id);
          setUserOrderCount(Array.isArray(orders) ? orders.length : 0);
        } catch {
          setUserOrderCount(0);
        }
      }
    };
    fetchOrderCount();
  }, [user?.id]);

  // Add this function to check if form is filled
  const checkFormFilled = (formData: any) => {
    const requiredFields = ['name', 'phone', 'email', 'street', 'city', 'state', 'postalCode', 'country'];
    return requiredFields.every(field => formData[field]?.trim().length > 0);
  };

  // Modify handleChange to include pincode check
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setIsFormFilled(checkFormFilled(newFormData));
    
    // Check pincode specifically
    if (name === 'postalCode') {
      if (value.length === 6) {
        setShowCodMessage(true);
        if (paymentMethod === 'cod') {
          setPaymentMethod('online'); // Switch to online payment if COD was selected
        }
      } else {
        setShowCodMessage(false);
      }
    }
  };

  // Validation function
  const validateForm = () => {
    if (!isFormFilled) {
      setErrorMessage("Please fill in all required fields.");
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

  // Payment verification with retry mechanism
  const verifyPayment = async (orderId: string, paymentId: string, retries = 3): Promise<boolean> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 Payment verification attempt ${attempt}/${retries}`);
        
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifypayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentId }),
        });

        if (!verifyRes.ok) {
          console.error(`❌ Verification attempt ${attempt} failed with status:`, verifyRes.status);
          if (attempt === retries) {
            const errorText = await verifyRes.text();
            console.error("Final error response:", errorText);
            return false;
          }
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }

        const verifyResData = await verifyRes.json();
        console.log(`📊 Verification attempt ${attempt} response:`, verifyResData);

        if (verifyResData.success) {
          console.log("✅ Payment verified successfully!");
          return true;
        } else if (verifyResData.status === "pending") {
          console.log("⏳ Payment is pending, waiting...");
          if (attempt === retries) {
            // For pending payments, we'll show a message but not treat as failure
            setErrorMessage("Payment is being processed. You'll receive confirmation shortly.");
            return false;
          }
          // Wait longer for pending payments
          await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
          continue;
        } else {
          console.error("❌ Payment verification failed:", verifyResData.message);
          setErrorMessage(verifyResData.message || "Payment verification failed.");
          return false;
        }
      } catch (error) {
        console.error(`❌ Verification attempt ${attempt} error:`, error);
        if (attempt === retries) {
          setErrorMessage("Payment verification failed. Please contact support.");
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
    return false;
  };

  // Coupon apply handler
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponStatus("Please enter a coupon code.");
      return;
    }
    if (!user?.id) {
      setCouponStatus("You must be logged in to apply a coupon.");
      return;
    }
    setIsApplyingCoupon(true);
    setCouponStatus("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), userId: user.id, paymentMethod, orderTotal: amount, userOrderCount }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountPercent(data.discountPercent);
        setDiscountAmount(data.discountAmount);
        setAppliedCoupon(data.appliedCoupon);
        setCouponStatus(data.message);
      } else {
        setDiscountPercent(0);
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponStatus(data.message || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponStatus("Error applying coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove coupon handler
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountPercent(0);
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponStatus("");
  };

  // Only show coupons allowed for the selected payment method
  const filteredCoupons = couponList.filter(
    (coupon) =>
      coupon.allowedPayments === "both" ||
      coupon.allowedPayments === paymentMethod
  );

  // Remove PREPAID2 if applied and paymentMethod switches to COD
  useEffect(() => {
    if (appliedCoupon === "PREPAID2" && paymentMethod !== "online") {
      handleRemoveCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod]);

  const handleQuickApplyCoupon = async (code: string) => {
    setCouponCode(code);
    setIsApplyingCoupon(true);
    setModalError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: user?.id, paymentMethod, orderTotal: amount, userOrderCount }),
      });
      const data = await res.json();
      if (data.valid) {
        // Find the coupon details from couponList
        const couponObj = couponList.find((c) => c.code === code);
        setDiscountPercent(couponObj ? couponObj.discount : data.discountPercent);
        setDiscountAmount(data.discountAmount);
        setAppliedCoupon(data.appliedCoupon);
        setCouponStatus(data.message);
        setShowCouponModal(false); // Close modal on success
      } else {
        setDiscountPercent(0);
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponStatus("");
        setModalError(data.message || "This coupon cannot be applied.");
      }
    } catch (err) {
      setModalError("Error applying coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Main payment handler
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
      discountedAmount: discountedAmount, // Pass discounted amount
      appliedCoupon: appliedCoupon, // Pass applied coupon code
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
            await clearCart(); // Clear both local and backend cart
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

  // Loading states
  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-gray-900 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
            {retryCount > 0 && (
              <p className="text-sm text-orange-600 mt-2">Retry attempt {retryCount}/2</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCouponModal) {
    console.log('All coupons from API:', couponList);
    console.log('Filtered coupons for modal:', filteredCoupons);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      {/* Add the style tag without jsx global */}
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      
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
                    <label className="text-sm font-medium text-gray-700">Full Name *</label>
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
                      <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email *</label>
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
                    <label className="text-sm font-medium text-gray-700">Street Address *</label>
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
                      <label className="text-sm font-medium text-gray-700">City *</label>
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
                      <label className="text-sm font-medium text-gray-700">State *</label>
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
                      <label className="text-sm font-medium text-gray-700">Postal Code *</label>
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
                      <label className="text-sm font-medium text-gray-700">Country *</label>
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
                    <span>₹{discountedAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      paymentMethod === 'online'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === 'online' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Online Payment</p>
                      <p className="text-sm text-gray-500">Pay securely with Cashfree</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      paymentMethod === 'cod'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === 'cod' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Cash on Delivery is not available for this order. Please select online payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Available Coupons UI */}
              <div className="mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded shadow font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-400 ${appliedCoupon ? 'bg-black text-white cursor-default' : 'bg-black text-white hover:bg-gray-900'}`}
                  onClick={() => setShowCouponModal(true)}
                  disabled={!!appliedCoupon}
                >
                  {appliedCoupon ? "Coupon Applied" : "Apply Coupon"}
                </button>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="ml-4 text-red-500 underline"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>

              {/* Coupon Modal Dialog */}
              {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative border border-gray-200 animate-fade-in">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowCouponModal(false)}
                      aria-label="Close"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-gray-900 text-center">Apply a Coupon</h2>
                    {loadingCoupons ? (
                      <div className="text-gray-500 py-8 text-center">Loading coupons...</div>
                    ) : (
                      <ul className="space-y-3 mb-4">
                        {filteredCoupons.length === 0 && (
                          <li className="text-gray-500 text-center">No coupons available.</li>
                        )}
                        {filteredCoupons.map((coupon) => (
                          <li key={coupon.code} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                            <div className="flex flex-col">
                              <span className="inline-block bg-gray-200 text-black text-xs font-semibold rounded px-2 py-0.5 mb-1 tracking-wide">{coupon.code}</span>
                              <span className="text-gray-700 text-sm">{coupon.description}</span>
                            </div>
                            <button
                              type="button"
                              className="ml-4 bg-black hover:bg-gray-900 focus:ring-2 focus:ring-gray-400 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition disabled:opacity-50"
                              disabled={isApplyingCoupon}
                              onClick={() => handleQuickApplyCoupon(coupon.code)}
                            >
                              Apply
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {modalError && <div className="text-red-600 text-sm mb-2 text-center font-medium">{modalError}</div>}
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!isFormFilled || isProcessing || !cashfreeLoaded}
                className={`w-full py-4 px-8 font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 ${
                  isFormFilled && !isProcessing && cashfreeLoaded
                    ? 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment powered by Cashfree
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
