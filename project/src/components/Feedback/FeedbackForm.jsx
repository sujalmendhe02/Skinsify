import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const FeedbackForm = ({ isOpen, onClose, itemId, sellerId, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const user = useAuthStore((state) => state.user);

  const handleFormSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await api.post('/feedback', {
        itemId,
        sellerId,
        rating,
        comment: data.comment
      });

      toast.success('Review submitted successfully!');
      setRating(0);
      setHoveredRating(0);
      if (onSubmit) {
        onSubmit();
      }
      onClose();
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to submit review');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => {
                    setRating(value);
                    setValue('rating', value);
                  }}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    } transition-colors`}
                    fill={value <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Your Review</label>
            <textarea
              {...register('comment', { 
                required: 'Please write your review',
                minLength: {
                  value: 10,
                  message: 'Review must be at least 10 characters long'
                }
              })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 min-h-[100px]"
              placeholder="Share your experience with this item..."
            />
            {errors.comment && (
              <p className="text-red-400 text-sm mt-1">{errors.comment.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;