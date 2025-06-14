"use client";

import useCart from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const SuccessfulPayment = () => {
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, []);

  return (
    <div className="related-products-container h-screen flex flex-col justify-center items-center gap-5 bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
        <p className="text-2xl font-bold text-green-600">Successful Payment</p>
        <p className="text-gray-700 mt-2">Thank you for your purchase.</p>
        <p className="text-gray-700">Please check your email, including your spam folder, for your order confirmation details.</p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 border border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
        >
          CONTINUE TO SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default SuccessfulPayment;
export const dynamic = "force-static";
