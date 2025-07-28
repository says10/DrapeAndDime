import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Completely open middleware - no authentication required for any route
export function middleware(request: NextRequest) {
  // Allow all requests without any authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};