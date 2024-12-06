import React from 'react';
import { useForm } from 'react-hook-form';
import { Star, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const FeedbackForm = ({ isOpen, onClose, itemId, sellerId }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const user = useAuthStore((state) => state.user);
  const rating = watch('rating', 0);

  const onSubmit = async (data) => {
    if (!user) return;

    try {
      await api.post('/feedback', {
        itemId,
        sellerId,
        rating: Number(data.rating),
        comment: data.comment
      });

      toast.success('Feedback submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to submit feedback');
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

        <h2 className="text-2xl font-bold text-white mb-6">Leave Feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('rating', value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register('rating', { required: 'Please select a rating' })}
            />
            {errors.rating && (
              <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Comment</label>
            <textarea
              {...register('comment', { required: 'Please leave a comment' })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              rows={4}
              placeholder="Share your experience..."
            />
            {errors.comment && (
              <p className="text-red-400 text-sm mt-1">{errors.comment.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;