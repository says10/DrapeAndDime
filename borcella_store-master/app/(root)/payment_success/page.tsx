"use client";
export const dynamic = "force-dynamic";

import { useCartWithUser } from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, ShoppingBag, Home, Mail, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const SuccessfulPayment = () => {
  const cart = useCartWithUser();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    if (!cartCleared && cart.cartItems.length > 0) {
      cart.clearCart();
      setCartCleared(true);
    }
    // Check if we have orderId and paymentId from Cashfree redirect
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    
    if (orderId && paymentId) {
      verifyPayment(orderId, paymentId);
    } else {
      setVerificationStatus('success'); // Assume success if no params
    }
  }, [searchParams, cartCleared, cart.cartItems.length]);

  const verifyPayment = async (orderId: string, paymentId: string) => {
    setIsVerifying(true);
    try {
      console.log("🔍 Verifying payment after redirect...");
      
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifypayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId }),
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          console.log("✅ Payment verified successfully after redirect!");
          setVerificationStatus('success');
        } else {
          console.error("❌ Payment verification failed:", verifyData.message);
          setVerificationStatus('failed');
        }
      } else {
        console.error("❌ Verification request failed:", verifyRes.status);
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      setVerificationStatus('failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-gray-900 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if verification failed
  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      {/* Premium Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative flex flex-col justify-center items-center min-h-screen px-8">
        {/* Success Card */}
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-12 text-center">
            <div className="relative">
              {/* Success Icon */}
              <div className="relative mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600 w-12 h-12" />
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
              </div>
              
              {/* Success Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Payment Successful!
              </h1>
              
              {/* Success Subtitle */}
              <p className="text-lg text-gray-600 font-medium">
                Your order has been confirmed
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12 space-y-8">
            {/* Thank You Message */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Thank you for your purchase
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We're excited to fulfill your order and deliver your new fashion pieces to you.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Order confirmation sent to your email</span>
              </div>
              <p className="text-sm text-gray-600 pl-8">
                Please check your inbox (including spam folder) for detailed order information and tracking updates.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
              </Link>
              
              <Link
                href="/orders"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                View Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a href="mailto:support@drapeanddime.com" className="text-gray-900 font-medium hover:underline">
              support@drapeanddime.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulPayment;
