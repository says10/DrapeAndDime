import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import MobileRootCarousel from "@/lib/models/MobileRootCarousel";

export async function GET() {
  await connectToDB();
  const doc = await MobileRootCarousel.findOne().sort({ updatedAt: -1 });
  return NextResponse.json({ items: doc?.items || [] });
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const { items } = await req.json();
  let doc = await MobileRootCarousel.findOne();
  if (doc) {
    doc.items = items;
    await doc.save();
  } else {
    doc = await MobileRootCarousel.create({ items });
  }
  return NextResponse.json({ success: true });
} 