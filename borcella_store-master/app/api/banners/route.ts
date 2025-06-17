import Banner from "@/lib/models/Banner";
import { connectToDB } from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const banners = await Banner.find().sort({ updatedAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("[banners_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}; 