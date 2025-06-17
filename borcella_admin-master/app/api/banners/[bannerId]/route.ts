import Banner from "@/lib/models/Banner";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { bannerId: string } }
) => {
  try {
    await connectToDB();
    const body = await req.json();
    
    const banner = await Banner.findByIdAndUpdate(
      params.bannerId,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true }
    );
    
    if (!banner) {
      return new NextResponse("Banner not found", { status: 404 });
    }
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error("[banner_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { bannerId: string } }
) => {
  try {
    await connectToDB();
    
    const banner = await Banner.findByIdAndDelete(params.bannerId);
    
    if (!banner) {
      return new NextResponse("Banner not found", { status: 404 });
    }
    
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("[banner_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}; 