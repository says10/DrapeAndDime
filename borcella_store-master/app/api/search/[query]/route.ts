import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to admin database for products
const connectToAdminDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "Borcelle_Admin"
    });
    console.log("Connected to admin database for search");
  } catch (err) {
    console.error("Error connecting to admin database:", err);
    throw err;
  }
};

// Define Product schema inline since we're connecting to admin DB
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  collections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Collection",
  },
  tags: {
    type: [String],
    default: [],
  },
  sizes: {
    type: String,
    required: true,
  },
  colors: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  try {
    const { query } = params;
    const decodedQuery = decodeURIComponent(query);
    
    console.log("Search API called with query:", decodedQuery);
    
    await connectToAdminDB();
    
    // Get Product model from admin database
    const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
    
    // Search for products that match the query in title, description, or category
    const products = await Product.find({
      $or: [
        { title: { $regex: decodedQuery, $options: 'i' } },
        { description: { $regex: decodedQuery, $options: 'i' } },
        { category: { $regex: decodedQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(decodedQuery, 'i')] } }
      ],
      isAvailable: true
    }).limit(10); // Limit to 10 results for dropdown
    
    console.log("Search results found:", products.length);
    
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("❌ Error in search API:", err);
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