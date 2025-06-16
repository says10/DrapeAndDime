import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
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
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    await connectToDB()

    let user = await User.findOne({ clerkId: userId })

    // When the user sign-in for the 1st, immediately we will create a new user for them
    if (!user) {
      user = await User.create({ clerkId: userId })
      await user.save()
    }

    return NextResponse.json(user, { status: 200 })
  } catch (err) {
    console.log("[users_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
