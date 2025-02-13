import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Star, ThumbsUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ItemActions from '../components/Items/ItemActions';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {}
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemRes, reviewsRes] = await Promise.all([
          api.get(`/items/${id}`),
          api.get(`/feedback/item/${id}`)
        ]);
        
        setItem(itemRes.data);
        setReviews(reviewsRes.data.reviews);
        setStats(reviewsRes.data.stats);

        // Check if user has already reviewed
        if (user) {
          const userReview = reviewsRes.data.reviews.find(
            review => review.buyerId._id === user.id
          );
          if (userReview) {
            setUserReview(userReview);
            setRating(userReview.rating);
            setReviewText(userReview.comment);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!item || !item.sellerId) {
      toast.error('Item information is missing');
      return;
    }

    try {
      const response = await api.post('/feedback', {
        itemId: id,
        sellerId: item.sellerId._id || item.sellerId, // Handle both populated and unpopulated seller
        rating,
        comment: reviewText
      });

      setUserReview(response.data);
      setReviews(prev => [response.data, ...prev.filter(r => r.buyerId._id !== user.id)]);
      toast.success('Review submitted successfully!');

      // Update stats
      const newStats = { ...stats };
      newStats.totalReviews++;
      newStats.averageRating = ((stats.averageRating * stats.totalReviews) + rating) / newStats.totalReviews;
      newStats.ratingDistribution[rating] = (newStats.ratingDistribution[rating] || 0) + 1;
      setStats(newStats);
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // const handleReviewHelpful = async (reviewId) => {
  //   try {
  //     await api.post(`/feedback/${reviewId}/helpful`);
  //     setReviews(prev => prev.map(review => 
  //       review._id === reviewId 
  //         ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
  //         : review
  //     ));
  //     toast.success('Marked as helpful');
  //   } catch (error) {
  //     toast.error('Failed to mark review as helpful');
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/marketplace"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Marketplace
        </Link>

        {/* Item Details Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column - Images/Video */}
            <div>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-auto rounded-lg mb-4"
              />
              {item.videoUrl && (
                <div className="mt-4">
                  <ReactPlayer
                    url={item.videoUrl}
                    width="100%"
                    height="300px"
                    controls
                    className="rounded-lg overflow-hidden"
                  />
                </div>
              )}
            </div>

            {/* Right Column - Item Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{item.name}</h1>
                {stats.totalReviews > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(stats.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-300">
                      ({stats.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 mb-6">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Game</p>
                  <p className="text-white font-semibold">{item.game}</p>
                </div>
                <div>
                  <p className="text-gray-400">Rarity</p>
                  <p className="text-white font-semibold">{item.rarity}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 mb-1">Price</p>
                    <p className="text-3xl font-bold text-white">₹{item.price}</p>
                  </div>
                </div>

                <ItemActions
                  item={item}
                  onPurchaseSuccess={() => {}}
                />

                <div className="flex items-center text-gray-400 mt-4">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Secure transaction with Razorpay payment protection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-700 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Statistics */}
              <div className="lg:col-span-1">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Reviews</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(stats.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white">
                      {stats.averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    {stats.totalReviews} global ratings
                  </p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <span className="text-gray-400 w-12">{star} star</span>
                        <div className="flex-1 mx-2 bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-yellow-400 rounded-full h-2"
                            style={{
                              width: `${((stats.ratingDistribution[star] || 0) / stats.totalReviews) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-gray-400 w-16 text-right">
                          {Math.round(((stats.ratingDistribution[star] || 0) / stats.totalReviews) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List and Form */}
              <div className="lg:col-span-2">
                {/* Review Form */}
                {user && user.id !== item.sellerId && !userReview && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Overall Rating</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onMouseEnter={() => setHoveredRating(value)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(value)}
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
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Review</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full bg-gray-600 text-white rounded-lg px-4 py-2 min-h-[100px]"
                          placeholder="What did you like or dislike about this item?"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-gray-300 font-medium mr-2">
                          {review.buyerId.email}
                        </span>
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
                      </div>
                      <p className="text-white mb-3">{review.comment}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {/* <button
                          onClick={() => handleReviewHelpful(review._id)}
                          className="flex items-center text-gray-400 hover:text-cyan-400"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpfulCount || 0})
                        </button> */}
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-center text-gray-400 py-4">
                      No reviews yet. Be the first to review this item!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

