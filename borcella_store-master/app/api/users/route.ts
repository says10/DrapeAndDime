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
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
              <img src="https://drapeanddime.shop/logo.png" alt="DrapeAndDime Logo" style="width: 80px; margin-bottom: 16px;" />
              <h1 style="color: #fff; margin: 0; font-size: 2rem; font-weight: 700;">Welcome to DrapeAndDime!</h1>
              <p style="color: #e0e0e0; margin: 12px 0 0 0; font-size: 1.1rem;">Your Fashion Journey Begins Here</p>
            </div>
            <div style="padding: 32px 24px; background: #fff;">
              <p style="font-size: 1.1rem; color: #333;">Hi there,</p>
              <p style="font-size: 1.1rem; color: #333;">Thank you for joining <b>DrapeAndDime</b>! We're thrilled to have you as part of our fashion community. Explore the latest trends, exclusive collections, and enjoy a seamless shopping experience.</p>
              <a href="https://drapeanddime.shop" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border-radius: 24px; text-decoration: none; font-weight: 600; font-size: 1.1rem;">Start Shopping</a>
              <p style="color: #888; font-size: 0.95rem; margin-top: 32px;">If you have any questions, just reply to this email or contact our support team. We're here to help!</p>
            </div>
            <div style="background: #2c3e50; color: #fff; text-align: center; padding: 18px 12px; font-size: 0.95rem;">
              &copy; ${new Date().getFullYear()} DrapeAndDime. All rights reserved.
            </div>
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
