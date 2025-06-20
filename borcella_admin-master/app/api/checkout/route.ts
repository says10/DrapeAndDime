import { NextRequest, NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";  // Import Cashfree SDK
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product"; // Assuming you have a Product model.

const allowedOrigin = `https://drapeanddime.shop`;

// Handle OPTIONS preflight request
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🛒 Checkout API called");

    await connectToDB();

    const body = await req.json();
    console.log("📩 Received request body:", body);

    const { cartItems, customer, shippingDetails, shippingRate, enteredName, discountedAmount, appliedCoupon } = body;

    if (!cartItems || cartItems.length === 0) {
      console.log("❌ No items in cart");
      return new NextResponse(JSON.stringify({ error: "No items to checkout" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Stock validation: Check if all items in the cart have sufficient stock
    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.item._id);
      if (!product) {
        return new NextResponse(JSON.stringify({ error: `Product not found: ${cartItem.item.title}` }), { status: 404, headers: { "Content-Type": "application/json" } });
      }
      if (product.quantity < cartItem.quantity) {
        return new NextResponse(
          JSON.stringify({ error: `${product.title} is out of stock. Only ${product.quantity} available.` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Calculate totalAmount
    const totalAmount = cartItems.reduce(
      (acc: number, item: { item: { price: number }; quantity: number }) =>
        acc + item.item.price * item.quantity,
      0
    );

    // Use discountedAmount if provided, else use totalAmount
    const finalAmount = typeof discountedAmount === 'number' && discountedAmount > 0 ? discountedAmount : totalAmount;

    console.log(`💰 Calculated totalAmount: ₹${totalAmount}, Final amount (after discount if any): ₹${finalAmount}`);

    // Create Cashfree order request
    const cashfreeOrderRequest = {
      order_amount: finalAmount,
      order_currency: "INR",
      order_id: `order_${new Date().getTime()}`,
      customer_details: {
        customer_id: customer.clerkId,
        customer_phone: shippingDetails.phone,
        customer_name: enteredName,
        customer_email: customer.email,
      },
      "request": {
      products: cartItems.map((item: { item: { _id: string }; color?: string; size?: string; quantity: number }) => ({
        product: item.item._id,
        color: item.color || "default",
        size: item.size || "default",
        quantity: item.quantity,
      })),
    },
    };

    // Initialize Cashfree Payment Gateway
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;  // Replace with your test client ID
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;  // Replace with your test client secret
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;  // Use SANDBOX for testing

    // Create order with Cashfree
    const cashfreeResponse = await Cashfree.PGCreateOrder("2025-01-01", cashfreeOrderRequest);

    if (cashfreeResponse.status === 200) {
      console.error("order created");
    }

    console.log("✅ Cashfree Order Created:", cashfreeResponse.data);

    // Save order in database
    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      customerEmail: customer.email,
      customerName: enteredName,
      customerPhone: shippingDetails.phone,
      products: cartItems.map((item: { item: { _id: string }; color?: string; size?: string; quantity: number }) => ({
        product: item.item._id,
        color: item.color || "default",
        size: item.size || "default",
        quantity: item.quantity,
      })),
      shippingAddress: {
        street: shippingDetails.street,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country,
      },
      shippingRate,
      totalAmount: finalAmount,
      appliedCoupon: appliedCoupon || null,
      cashfreeOrderId: cashfreeResponse.data.order_id,
      status: "NOT PAID",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes instead of 1 minute
    });

    await newOrder.save();
    console.log("🗃️ Order saved to MongoDB:", newOrder);

    // Respond with order details to frontend
    return new NextResponse(
      JSON.stringify({
        orderId: cashfreeResponse.data.order_id,
        paymentSessionId: cashfreeResponse.data.payment_session_id,
        amount: finalAmount,
        currency: "INR",
        cartItems,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (err) {
    console.error("❌ [checkout_POST] Error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
