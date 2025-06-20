import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Coupon from "@/lib/models/Coupon";
import { getStoreCouponModel } from "@/lib/models/StoreCoupon";

export async function GET() {
  await connectToDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const { code, description, discount, type, allowedPayments, minOrderValue, maxDiscount, minOrderCount, maxOrderCount } = await req.json();
  if (!code || !description || !discount || !type) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  try {
    const coupon = await Coupon.create({ code, description, discount, type, allowedPayments: allowedPayments || "both", minOrderValue, maxDiscount, minOrderCount, maxOrderCount });

    // Also upsert in store DB
    const StoreCoupon = await getStoreCouponModel();
    await StoreCoupon.updateOne(
      { code: coupon.code },
      { $set: { description, discount, type, allowedPayments: allowedPayments || "both", createdAt: coupon.createdAt, minOrderValue, maxDiscount, minOrderCount, maxOrderCount } },
      { upsert: true }
    );

    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Coupon code required." }, { status: 400 });
  const deleted = await Coupon.findOneAndDelete({ code });
  // Also delete from store DB
  const StoreCoupon = await getStoreCouponModel();
  await StoreCoupon.deleteOne({ code });
  if (!deleted) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  return NextResponse.json({ success: true });
} 