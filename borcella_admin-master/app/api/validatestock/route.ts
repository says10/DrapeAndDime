import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

const allowedOrigin = `${process.env.ECOMMERCE_STORE_URL}`;

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
    console.log("🛒 Stock validation API called");

    await connectToDB();

    const body = await req.json();
    console.log("📩 Received request body:", body);

    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      console.log("❌ No items in cart");
      return new NextResponse("No items in cart", { status: 400 });
    }

    // Stock validation: Check if all items in the cart have sufficient stock
    const stockCheck: { [key: string]: boolean } = {};

    for (const cartItem of cartItems) {
      // Access the itemId directly instead of cartItem.item._id
      const product = await Product.findById(cartItem.itemId); // Using itemId here
      if (!product) {
        return new NextResponse(`Product not found: ${cartItem.itemId}`, { status: 404 });
      }
      if (product.quantity < cartItem.quantity) {
        stockCheck[cartItem.itemId] = false;  // Out of stock
      } else {
        stockCheck[cartItem.itemId] = true;   // In stock
      }
    }
    console.log(stockCheck);

    // Respond with stock validation result
    return new NextResponse(
      JSON.stringify(stockCheck),
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
    console.error("❌ [validateStock_POST] Error:", err);
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
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}
