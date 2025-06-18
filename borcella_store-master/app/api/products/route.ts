import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to admin database for products
const connectToAdminDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "Borcelle_Admin"
    });
    console.log("Connected to admin database for products");
  } catch (err) {
    console.error("Error connecting to admin database:", err);
    throw err;
  }
};

// Define Product schema inline since we're connecting to admin DB - match admin schema exactly
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  media: [String],
  category: String,
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String],
  sizes: String,
  colors: String,
  price: { type: Number },
  originalPrice: { type: Number },
  expense: { type: Number },
  quantity: { type: Number },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

export async function GET(req: NextRequest) {
  try {
    console.log('Products API called');
    await connectToAdminDB();

    const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

    // Simple fetch all available products
    const products = await Product.find({ isAvailable: true }).lean();
    
    console.log(`Found ${products.length} products`);
    console.log('Products:', products);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: products.length,
        hasNextPage: false,
        hasPrevPage: false
      },
      filters: {
        categories: [],
        tags: [],
        sizes: [],
        colors: []
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 