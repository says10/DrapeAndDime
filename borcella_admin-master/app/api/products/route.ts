import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

export const dynamic = "force-dynamic"; // Ensure API routes are dynamic

// ✅ CREATE Product
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDB();

    const body = await req.json();
    const {
      title, description, media, category, collections,
      tags, sizes, colors, price, quantity
    } = body;

    if (!title || !description || !media || !category || !price || !quantity) {
      return new NextResponse("Not enough data to create a product", { status: 400 });
    }

    const isAvailable = quantity > 0;

    const newProduct = await Product.create({
      title, description, media, category, collections,
      tags, sizes, colors, price, quantity, isAvailable
    });

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error("❌ Error creating product:", err);
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
}

// ✅ UPDATE Product
export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDB();

    const id = req.nextUrl.searchParams.get("id"); // ✅ Fix query param extraction
    if (!id) return new NextResponse("Product ID is required", { status: 400 });

    const body = await req.json();
    const {
      title, description, media, category, collections,
      tags, sizes, colors, price, quantity
    } = body;

    if (!title || !description || !media || !category || !price || !quantity) {
      return new NextResponse("Not enough data to update the product", { status: 400 });
    }

    const isAvailable = quantity > 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, media, category, collections, tags, sizes, colors, price, quantity, isAvailable },
      { new: true }
    );

    if (!updatedProduct) return new NextResponse("Product not found", { status: 404 });

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection && !collection.products.includes(updatedProduct._id)) {
          collection.products.push(updatedProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error updating product:", err);
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
}

// ✅ FETCH All Products
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching products:", err);
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
}
