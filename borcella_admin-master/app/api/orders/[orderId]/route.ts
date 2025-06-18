import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
  try {
    console.log(`🔹 Received orderId: ${params.orderId}`);

    await connectToDB();
    console.log("✅ Connected to MongoDB");

    // Ensure orderId is trimmed
    const orderId = params.orderId.trim();
    console.log(`🔹 Trimmed orderId: ${orderId}`);

    // Validate if orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error(`❌ Invalid ObjectId format: ${orderId}`);
      return new NextResponse(JSON.stringify({ message: "Invalid orderId format" }), { status: 400 });
    }

    // Convert to ObjectId
    const objectId = new mongoose.Types.ObjectId(orderId);
    console.log(`✅ Converted to ObjectId: ${objectId}`);

    // Use aggregation to query the order
    const orderDetails = await Order.aggregate([
      { $match: { _id: objectId } },  // Match the order by _id
      { $lookup: {
        from: "products",          // Lookup products collection
        localField: "products.product",  // Field to match in the order document
        foreignField: "_id",       // Field to match in the products collection
        as: "productDetails"       // Alias for the resulting product data
      }},
      { $limit: 1 }  // Limit to a single result
    ]);

    if (orderDetails.length > 0) {
      console.log("🔹 Order details found:", orderDetails[0]);
      return NextResponse.json({ orderDetails: orderDetails[0] }, { status: 200 });
    } else {
      console.warn(`⚠️ No order found with ObjectId: ${objectId}`);
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 });
    }
  } catch (err: any) {
    console.error("❌ Error fetching order:", err);
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
};

export const dynamic = "force-dynamic";
