// app/middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Allow all methods for CORS
export function middleware(req: NextRequest) {
  const allowedOrigin = `${process.env.ADMIN_DASHBOARD_URL}/api/checkout`; // Update this to match your frontend's origin

  const res = NextResponse.next();

  // Set CORS headers
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type, Origin");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  return res;
}

export const config = {
  matcher: "/api/*", // Apply middleware to API routes
};
