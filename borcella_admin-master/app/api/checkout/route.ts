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

// Helper function to create timeout promise
const createTimeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Helper function to create Cashfree order with timeout
const createCashfreeOrderWithTimeout = async (orderRequest: any, timeoutMs = 15000): Promise<any> => {
  try {
    const orderPromise = Cashfree.PGCreateOrder("2025-01-01", orderRequest);
    const timeoutPromise = createTimeoutPromise(timeoutMs);
    
    const response = await Promise.race([orderPromise, timeoutPromise]);
    return response;
  } catch (error) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log("🛒 Checkout API called");

    await connectToDB();

    const body = await req.json();
    console.log("📩 Received request body:", body);

    const { cartItems, customer, shippingDetails, shippingRate, enteredName } = body;

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      console.log("❌ No items in cart");
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "No items to checkout" 
        }), 
        { 
          status: 400,
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

    if (!customer || !customer.email || !customer.clerkId) {
      console.log("❌ Missing customer information");
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Missing customer information" 
        }), 
        { 
          status: 400,
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

    if (!shippingDetails || !enteredName) {
      console.log("❌ Missing shipping details");
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Missing shipping details" 
        }), 
        { 
          status: 400,
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

    // Enhanced stock validation with detailed error messages
    const stockValidationErrors = [];
    const validatedItems = [];

    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.item._id);
      
      if (!product) {
        stockValidationErrors.push(`Product not found: ${cartItem.item.title}`);
        continue;
      }

      if (!product.isAvailable) {
        stockValidationErrors.push(`${product.title} is currently unavailable`);
        continue;
      }

      if (product.quantity < cartItem.quantity) {
        stockValidationErrors.push(
          `${product.title} is out of stock. Only ${product.quantity} available, but ${cartItem.quantity} requested.`
        );
        continue;
      }

      validatedItems.push({
        ...cartItem,
        product: product
      });
    }

    if (stockValidationErrors.length > 0) {
      console.log("❌ Stock validation failed:", stockValidationErrors);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Some items are out of stock or unavailable",
          errors: stockValidationErrors
        }), 
        { 
          status: 400,
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

    // Calculate totalAmount
    const totalAmount = validatedItems.reduce(
      (acc: number, item: { item: { price: number }; quantity: number }) =>
        acc + item.item.price * item.quantity,
      0
    );

    console.log(`💰 Calculated totalAmount: ₹${totalAmount}`);

    // Create Cashfree order request
    const cashfreeOrderRequest = {
      order_amount: totalAmount,
      order_currency: "INR",
      order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_details: {
        customer_id: customer.clerkId,
        customer_phone: shippingDetails.phone,
        customer_name: enteredName,
        customer_email: customer.email,
      },
    };

    // Initialize Cashfree Payment Gateway
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

    // Create order with Cashfree with timeout
    let cashfreeResponse: any;
    try {
      cashfreeResponse = await createCashfreeOrderWithTimeout(cashfreeOrderRequest, 15000);
      console.log("✅ Cashfree Order Created:", cashfreeResponse.data);
    } catch (cashfreeError: any) {
      console.error("❌ Error creating Cashfree order:", cashfreeError);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Failed to create payment order",
          error: cashfreeError?.message || "Unknown error"
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

    if (cashfreeResponse.status !== 200) {
      console.error("❌ Cashfree order creation failed with status:", cashfreeResponse.status);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Payment gateway error",
          error: "Failed to create order with payment gateway"
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

    // Validate Cashfree response
    if (!cashfreeResponse.data.order_id || !cashfreeResponse.data.payment_session_id) {
      console.error("❌ Invalid Cashfree response:", cashfreeResponse.data);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Invalid response from payment gateway"
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

    // Save order in database
    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      customerEmail: customer.email,
      customerName: enteredName,
      customerPhone: shippingDetails.phone,
      products: validatedItems.map((item: { item: { _id: string }; color?: string; size?: string; quantity: number }) => ({
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
      totalAmount,
      cashfreeOrderId: cashfreeResponse.data.order_id,
      status: "NOT PAID",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
    });

    try {
      await newOrder.save();
      console.log("🗃️ Order saved to MongoDB:", newOrder._id);
    } catch (dbError: any) {
      console.error("❌ Error saving order to database:", dbError);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Failed to save order",
          error: dbError?.message || "Database error"
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

    // Respond with order details to frontend
    return new NextResponse(
      JSON.stringify({
        success: true,
        orderId: cashfreeResponse.data.order_id,
        paymentSessionId: cashfreeResponse.data.payment_session_id,
        amount: totalAmount,
        currency: "INR",
        cartItems: validatedItems,
        orderDetails: {
          orderId: newOrder._id,
          cashfreeOrderId: cashfreeResponse.data.order_id,
          totalAmount: totalAmount,
          expiresAt: newOrder.expiresAt
        }
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
  } catch (error: any) {
    console.error("❌ [checkout_POST] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: error?.message || "Unknown error"
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
