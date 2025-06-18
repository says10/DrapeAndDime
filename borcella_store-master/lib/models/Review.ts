import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    maxlength: 500
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review; 