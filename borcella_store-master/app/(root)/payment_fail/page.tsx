"use client";

import Link from "next/link";

import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  

  return (
    <div className="related-products-container h-screen flex flex-col justify-center items-center gap-5 bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <XCircle className="text-red-500 w-16 h-16 mb-4" />
        <p className="text-2xl font-bold text-red-600">Payment Failed</p>
        <p className="text-gray-700 mt-2">Something went wrong with your payment.</p>
        <p className="text-gray-700">Please try again or contact support if the issue persists.</p>
        
        <Link
          href="/cart"
          className="mt-4 px-6 py-3 border border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
        >
          TRY AGAIN
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
export const dynamic = "force-static";
