import express from 'express';
import Feedback from '../models/Feedback.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.post('/', auth, async (req, res) => {
  try {
    const { itemId, sellerId, rating, comment } = req.body;

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
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ sellerId: req.params.sellerId })
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;