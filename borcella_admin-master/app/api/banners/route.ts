import Banner from "@/lib/models/Banner";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("[banners_GET]", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();
    
    const banner = await Banner.create({
      ...body,
      updatedAt: new Date(),
    });
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error("[banners_POST]", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}; 