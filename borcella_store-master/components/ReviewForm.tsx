"use client";

import { useState } from "react";
import { Star, Send, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  onClose: () => void;
}

const ReviewForm = ({ productId, onReviewSubmitted, onClose }: ReviewFormProps) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (review.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.username || "Anonymous",
          rating,
          review: review.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Write a Review</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-900">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-900">
              Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 text-right">
              {review.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || review.trim().length < 10}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
              isSubmitting || rating === 0 || review.trim().length < 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 hover:shadow-xl active:scale-[0.98] transform"
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 