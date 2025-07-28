import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Middleware Test - Borcella",
  description: "Testing middleware functionality",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TestMiddlewarePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Middleware Test</h1>
        <p className="text-lg text-gray-600">
          If you can see this page, the middleware is working correctly.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          This page should be accessible to Google crawlers without any 401 errors.
        </p>
      </div>
    </div>
  );
} 