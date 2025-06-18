import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Try to get userId from Clerk auth first
    let userId = auth()?.userId;
    
    // If not available from auth, try to get from query params
    if (!userId) {
      const url = new URL(req.url);
      const queryUserId = url.searchParams.get('userId');
      if (queryUserId) {
        userId = queryUserId;
      }
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectToDB()

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const { productId } = await req.json()

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 })
    }

    const isLiked = user.wishlist.includes(productId)

    if (isLiked) {
      // Dislike
      user.wishlist = user.wishlist.filter((id: string) => id !== productId)
    } else {
      // Like
      user.wishlist.push(productId)
    }

    await user.save()
    
    return NextResponse.json(user, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error in wishlist API:", err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: err?.message || "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
