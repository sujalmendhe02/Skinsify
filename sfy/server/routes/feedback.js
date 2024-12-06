import express from 'express';
import Feedback from '../models/Feedback.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create feedback
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, sellerId, rating, comment } = req.body;

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

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      itemId,
      sellerId,
      buyerId: req.user.userId
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already left feedback for this purchase' });
    }

    const feedback = new Feedback({
      itemId,
      sellerId,
      buyerId: req.user.userId,
      rating,
      comment
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({ message: 'Failed to create feedback' });
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