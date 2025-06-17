import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Banner from "@/lib/models/Banner";

// Connect to admin database specifically for banners
const connectToAdminDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "Borcelle_Admin"
    });
    console.log("Connected to admin database for banners");
  } catch (err) {
    console.error("Error connecting to admin database:", err);
    throw err;
  }
};

export async function GET() {
  try {
    console.log("API: Banners route called");
    await connectToAdminDB();
    console.log("API: Admin database connected");
    
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    console.log("API: Banners found:", banners.length);
    console.log("API: Banners data:", banners);
    
    return NextResponse.json(banners);
  } catch (error) {
    console.error("API: Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
} 