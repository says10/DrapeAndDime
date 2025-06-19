import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { sendEmail } from "@/lib/email";

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
      // Send welcome email
      await sendEmail({
        to: req.headers.get("x-user-email") || "",
        subject: "Welcome to DrapeAndDime!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1 style="color: #764ba2;">Welcome!</h1>
            <p>Thank you for joining <b>DrapeAndDime</b>. We're thrilled to have you as part of our fashion community!</p>
            <p>Start shopping the latest trends now: <a href="https://drapeanddime.shop" style="color: #667eea;">Visit our store</a></p>
            <hr/>
            <p style="font-size: 12px; color: #888;">If you have any questions, reply to this email or contact our support team.</p>
          </div>
        `,
      });
    }

    return NextResponse.json(user, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error in users API:", err);
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
