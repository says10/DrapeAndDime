import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Coupon from "@/lib/models/Coupon";

export async function GET() {
  await connectToDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json(coupons);
} 