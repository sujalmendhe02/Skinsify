import React from 'react';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ReviewsList = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-300">{review.buyerId.email}</span>
            </div>
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-white mt-2">{review.comment}</p>
          {review.itemId && (
            <div className="mt-2 flex items-center">
              <img
                src={review.itemId.imageUrl}
                alt={review.itemId.name}
                className="w-10 h-10 rounded object-cover"
              />
              <span className="ml-2 text-sm text-gray-400">{review.itemId.name}</span>
            </div>
          )}
        </div>
      ))}
      {reviews.length === 0 && (
        <p className="text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
};

export default ReviewsList;