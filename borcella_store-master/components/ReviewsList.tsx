"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle, ThumbsUp, Calendar } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ReviewForm from "./ReviewForm";

interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  helpful: number;
  createdAt: string;
}

interface ReviewsListProps {
  productId: string;
  onReviewSubmitted: () => void;
}

const ReviewsList = ({ productId, onReviewSubmitted }: ReviewsListProps) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews?page=${page}&limit=5`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmitted = () => {
    fetchReviews(1); // Refresh reviews
    onReviewSubmitted();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Great";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 font-serif">Customer Reviews</h3>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 font-serif">Customer Reviews</h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(avgRating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : i < avgRating 
                            ? "fill-yellow-400/50 text-yellow-400" 
                            : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-gray-900 font-semibold">{avgRating}</span>
                <span className="text-gray-600">({totalReviews} reviews)</span>
              </div>
              <span className="text-sm text-gray-500">• {getRatingText(avgRating)}</span>
            </div>
          )}
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(review.createdAt)}
                    </div>
                    {review.helpful > 0 && (
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpful} helpful
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.review}</p>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => fetchReviews(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => fetchReviews(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h4>
          <p className="text-gray-600 mb-6">Be the first to share your experience with this product!</p>
          {user && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Write the First Review
            </button>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default ReviewsList; 