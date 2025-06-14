import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/lib/models/Order";  // Adjust the import according to your project structure



interface ParamsType {
  params: {
    orderId: string;
  };
}

export async function PATCH(req:NextRequest, { params }:ParamsType) {
  try {
    // Extract the orderId from params
    const { orderId } = params;
    console.log("Incoming request to update order:", orderId);

    // Parse the body of the request
    const body = await req.json();
    const { status, trackingLink } = body;

    // Ensure required fields exist
    if (!status || !trackingLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert orderId to ObjectId
    const objectId =new  mongoose.Types.ObjectId(orderId);

    // Aggregate query to get the order along with product details
    const orderDetails = await Order.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "products", // The collection to join
          localField: "products.product", // Field to join on in Order collection
          foreignField: "_id", // Field to join on in Products collection
          as: "productDetails", // The result of the join
        },
      },
      { $limit: 1 },
    ]);

    if (!orderDetails || orderDetails.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Extract the updated order data from the aggregation result
    const order = orderDetails[0]; // Since we are using $limit: 1, it will be a single order

    // Perform update operation on the order's fields
    order.status = status;
    order.trackingLink = trackingLink;

    // Now update the order using the aggregation result and save it back to the DB
    const updatedOrder = await Order.updateOne(
      { _id: objectId },  // Find the order using ObjectId
      { 
        $set: { 
          status, 
          trackingLink 
        }
      }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Return the success response with the updated order
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
