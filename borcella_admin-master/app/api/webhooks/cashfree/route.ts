import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    console.log("🔔 Cashfree Webhook Received");
    
    const body = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));

    const { 
      orderId, 
      orderAmount, 
      referenceId, 
      txStatus, 
      paymentMode, 
      txMsg, 
      txTime 
    } = body;

    console.log("🔍 Processing webhook for order:", orderId);
    console.log("💰 Amount:", orderAmount);
    console.log("📊 Status:", txStatus);

    await connectToDB();

    // Find the order by Cashfree order ID
    const order = await Order.findOne({ cashfreeOrderId: orderId });

    if (!order) {
      console.error("❌ Order not found for Cashfree order ID:", orderId);
      return new NextResponse("Order not found", { status: 404 });
    }

    console.log("📦 Found order:", order._id);

    // Update order status based on payment status
    if (txStatus === "SUCCESS") {
      console.log("✅ Payment successful, updating order status");
      
      order.status = "Paid";
      order.paymentId = referenceId;
      order.paymentMode = paymentMode;
      order.paymentTime = new Date(txTime);
      await order.save();

      console.log("✅ Order status updated to Paid");
    } else if (txStatus === "FAILED") {
      console.log("❌ Payment failed, updating order status");
      order.status = "Failed";
      order.paymentId = referenceId;
      await order.save();
    } else if (txStatus === "PENDING") {
      console.log("⏳ Payment pending");
      order.status = "Pending";
      order.paymentId = referenceId;
      await order.save();
    }

    console.log("✅ Webhook processed successfully");
    return new NextResponse("Webhook processed", { status: 200 });

  } catch (error: any) {
    console.error("❌ Webhook processing error:", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Webhook processing failed",
        error: error?.message || "Unknown error"
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

export const dynamic = "force-dynamic"; 