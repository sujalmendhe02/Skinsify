import express from 'express';
import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create feedback
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, sellerId, rating, comment } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid item or seller ID' });
    }

    // Verify that the user has purchased the item
    const transaction = await Transaction.findOne({
      buyer: req.user.userId,
      seller: sellerId,
      item: itemId,
      status: 'completed'
    });

    if (!transaction) {
      return res.status(403).json({ message: 'You must purchase the item before leaving feedback' });
    }

    // Validate rating and comment
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.length < 10) {
      return res.status(400).json({ message: 'Review must be at least 10 characters long' });
    }

    // Check if feedback already exists
    let feedback = await Feedback.findOne({
      itemId,
      buyerId: req.user.userId
    });

    if (feedback) {
      // Update existing feedback
      feedback.rating = rating;
      feedback.comment = comment;
      await feedback.save();
    } else {
      // Create new feedback
      feedback = new Feedback({
        itemId,
        sellerId,
        buyerId: req.user.userId,
        rating,
        comment
      });
      await feedback.save();
    }

    // Populate and return the feedback
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('buyerId', 'email')
      .populate('itemId', 'name imageUrl');

    res.status(feedback ? 200 : 201).json(populatedFeedback);
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create feedback',
      error: error.message 
    });
  }
});

// Get item's feedback
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Feedback.find({ itemId: req.params.itemId })
      .sort({ createdAt: -1 })
      .populate('buyerId', 'email')
      .populate('itemId', 'name imageUrl');
    
    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {};
    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    res.json({
      reviews,
      stats: {
        averageRating,
        totalReviews,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get item feedback error:', error);
    res.status(500).json({ message: 'Failed to get item feedback' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Failed to mark review as helpful' });
  }
});

// Get seller's feedback
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ sellerId: req.params.sellerId })
      .sort({ createdAt: -1 })
      .populate('buyerId', 'email')
      .populate('itemId', 'name imageUrl');
    
    res.json(feedbacks);
  } catch (error) {
    console.error('Get seller feedback error:', error);
    res.status(500).json({ message: 'Failed to get seller feedback' });
  }
});

// Get seller's rating statistics
router.get('/stats/:sellerId', async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { sellerId: req.params.sellerId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: {}
      });
    }

    // Calculate rating distribution
    const ratingDistribution = stats[0].ratingCounts.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    res.json({
      averageRating: stats[0].averageRating,
      totalFeedbacks: stats[0].totalFeedbacks,
      ratingDistribution
    });
  } catch (error) {
    console.error('Get seller stats error:', error);
    res.status(500).json({ message: 'Failed to get seller statistics' });
  }
});

export default router;