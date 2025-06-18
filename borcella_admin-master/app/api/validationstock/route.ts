import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import { z } from "zod";

// Allowed origin for CORS
const allowedOrigin = "https://drapeanddime.shop";

// CORS handling for OPTIONS preflight request
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

// CORS handling for POST request and stock validation for multiple items
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    console.log("📩 Received request body:", body);

    // Define schema for validating incoming request (simplified)
    const stockValidationSchema = z.object({
      cartItems: z.array(
        z.object({
          item: z.object({
            _id: z.string(),  // The required field for identifying the product
            title: z.string(),  // Optional, for display or reference
            price: z.number(),  // Optional, for display or reference
          }),
          quantity: z.number().min(1),  // Required field for the quantity
        })
      ),
    });

    // Parse and validate the body against the schema
    const { cartItems } = stockValidationSchema.parse(body);

    // Connect to the database
    await connectToDB();

    // Prepare the list of validation results for each cart item
    const validationResults = [];

    // Iterate through each cart item to check stock
    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.item._id);

      // Check if product exists
      if (!product) {
        validationResults.push({
          productId: cartItem.item._id,
          status: "error",
          message: "Product not found",
        });
        continue;
      }

      // Check if there is sufficient stock
      if (product.quantity < cartItem.quantity) {
        validationResults.push({
          productId: cartItem.item._id,
          status: "error",
          message: `Insufficient stock. Available quantity: ${product.quantity}`,
        });
      } else {
        validationResults.push({
          productId: cartItem.item._id,
          status: "success",
          message: "Stock is available",
          availableStock: product.quantity,
        });
      }
    }

    // Check if there are any errors in the validation results
    const hasErrors = validationResults.some(result => result.status === "error");

    if (hasErrors) {
      // If there's any error (out of stock), return an error response
      return new NextResponse(
        JSON.stringify({
          status: "error",
          validationResults,
          message: "Some items are out of stock or unavailable.",
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

    // If all items have valid stock, return a success response
    return new NextResponse(
      JSON.stringify({
        status: "success",
        validationResults,
        isInStock: validationResults.every(result => result.status === "success"),
        message: "All items are in stock.",
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
    console.error("❌ [validationStockRoute_POST] Error:", err);
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
