import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("[customerOrders_GET]", err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: err instanceof Error ? err.message : "Unknown error"
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

export const dynamic = "force-dynamic";
