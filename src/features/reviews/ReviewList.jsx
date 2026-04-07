import React from "react";
import { Star } from "lucide-react";
import { useGetReviewsQuery } from "./reviewApi.js";




function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewList({ id }) {
  const { data: reviews, isLoading, error } = useGetReviewsQuery(id);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.data?.message}</p>;
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="max-w-3xl  p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="mt-2">
          <StarRating rating={Number(avgRating.toFixed(1))} />
          <p className="text-sm text-gray-500 mt-1">
            Based on {reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <img
                src={review.user?.image || `https://ui-avatars.com/api/?name=${review.user.username}`}
                alt={review.user.username}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">
                    {review.user.username}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <div className="mt-1">
                  <StarRating rating={review.rating} />
                </div>

                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
