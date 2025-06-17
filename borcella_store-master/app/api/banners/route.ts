import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Banner from "@/lib/models/Banner";

export async function GET() {
  try {
    await connectToDB();
    
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
} 