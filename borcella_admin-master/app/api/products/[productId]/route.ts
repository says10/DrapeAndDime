import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch product by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err: any) {
    console.error("❌ Error fetching product:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
};

// ✅ PUT: Update product by ID
export const PUT = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const product = await Product.findById(params.productId);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const body = await req.json();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      originalPrice,
      quantity
    } = body;

    if (!title || !description || !media || !category || !price || quantity === undefined) {
      return NextResponse.json({ message: "Not enough data to update the product" }, { status: 400 });
    }

    // Defensive check
    const safeCollections = Array.isArray(collections) ? collections : [];

    const addedCollections = safeCollections.filter(
      (id: string) => !product.collections.includes(id)
    );

    const removedCollections = product.collections.filter(
      (id: string) => !safeCollections.includes(id)
    );

    // Update collection references
    await Promise.all([
      ...addedCollections.map((id: string) =>
        Collection.findByIdAndUpdate(id, { $push: { products: product._id } })
      ),
      ...removedCollections.map((id: string) =>
        Collection.findByIdAndUpdate(id, { $pull: { products: product._id } })
      ),
    ]);

    const isAvailable = quantity > 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections: safeCollections,
        tags: Array.isArray(tags) ? tags : [],
        sizes,
        colors,
        price,
        originalPrice,
        quantity,
        isAvailable,
        updatedAt: new Date()
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (err: any) {
    console.error("❌ Error updating product:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
};

// DELETE: Delete product by ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const product = await Product.findById(params.productId);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await Product.findByIdAndDelete(product._id);

    // Remove product from collections
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Error deleting product:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
