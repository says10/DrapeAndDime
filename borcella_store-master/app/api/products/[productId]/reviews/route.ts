import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Review from "@/lib/models/Review";

// GET reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId: params.productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ productId: params.productId });
    
    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { productId: params.productId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    
    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

    return NextResponse.json({
      reviews,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit)
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { userId, userName, rating, review } = body;

    // Validate required fields
    if (!userId || !userName || !rating || !review) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId: params.productId,
      userId: userId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      productId: params.productId,
      userId,
      userName,
      rating,
      review
    });

    await newReview.save();

    return NextResponse.json({
      message: "Review added successfully",
      review: newReview
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
} 