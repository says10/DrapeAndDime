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

// Define Product schema inline since we're connecting to admin DB
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: [String], required: true },
  category: { type: String, required: true },
  collections: { type: [mongoose.Schema.Types.ObjectId], ref: "Collection" },
  tags: { type: [String], default: [] },
  sizes: { type: String, required: true },
  colors: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  expense: { type: Number, required: true },
  quantity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export async function GET(req: NextRequest) {
  try {
    await connectToAdminDB();

    const { searchParams } = new URL(req.url);
    
    // Get query parameters
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const sizes = searchParams.get('sizes');
    const colors = searchParams.get('colors');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');

    // Get Product model from admin database
    const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

    // Build filter object
    const filter: any = { isAvailable: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (tags) {
      const tagArray = tags.split(',').map((tag: string) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (sizes) {
      const sizeArray = sizes.split(',').map((size: string) => size.trim());
      // Filter sizes as string fields using regex
      filter.sizes = { $regex: sizeArray.join('|'), $options: 'i' };
    }

    if (colors) {
      const colorArray = colors.split(',').map((color: string) => color.trim());
      // Filter colors as string fields using regex
      filter.colors = { $regex: colorArray.join('|'), $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get unique values for filters - handle string fields properly
    const categories = await Product.distinct('category', { isAvailable: true });
    const allTags = await Product.distinct('tags', { isAvailable: true });
    
    // For sizes and colors, we need to get all unique values from string fields
    const allProducts = await Product.find({ isAvailable: true }, 'sizes colors').lean();
    
    // Extract unique sizes from string fields
    const allSizes = new Set<string>();
    allProducts.forEach((product: any) => {
      if (product.sizes) {
        const sizes = product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
        sizes.forEach((size: string) => allSizes.add(size));
      }
    });

    // Extract unique colors from string fields
    const allColors = new Set<string>();
    allProducts.forEach((product: any) => {
      if (product.colors) {
        const colors = product.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
        colors.forEach((color: string) => allColors.add(color));
      }
    });

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        categories: categories.filter(Boolean),
        tags: allTags.filter(Boolean).flat(),
        sizes: Array.from(allSizes),
        colors: Array.from(allColors)
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