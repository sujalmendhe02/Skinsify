import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_VTeHEBn3aNjFQV',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'XgWhkUAIqIkH6btlq6UTb7ak'
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, itemId, sellerId, gameId, gameType } = req.body;
    
    if (!amount || !itemId || !sellerId || !gameId || !gameType) {
      return res.status(400).json({ 
        message: 'Missing required parameters' 
      });
    }

    // Verify seller exists and has the item with available quantity
    const seller = await User.findById(sellerId);
    const item = await Item.findOne({ _id: itemId, sellerId });

    if (!seller || !item) {
      return res.status(404).json({
        message: 'Seller or item not found'
      });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({
        message: 'Item is out of stock'
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Create transaction record with game details
    const transaction = new Transaction({
      buyer: req.user.userId,
      seller: sellerId,
      item: itemId,
      amount: amount,
      orderId: order.id,
      status: 'pending',
      gameDetails: {
        gameId: gameId,
        gameType: gameType
      }
    });

    await transaction.save();

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ 
      message: 'Payment initialization failed',
      error: error.message 
    });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing required payment verification parameters' 
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update transaction status and include game details
      const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
      
      if (!transaction) {
        return res.status(404).json({ 
          message: 'Transaction not found' 
        });
      }

      // Decrease item quantity
      const item = await Item.findById(transaction.item);
      if (!item || item.quantity <= 0) {
        return res.status(400).json({
          message: 'Item is out of stock'
        });
      }

      item.quantity -= 1;
      await item.save();

      // Update transaction
      transaction.status = 'completed';
      transaction.paymentId = razorpay_payment_id;
      await transaction.save();

      const updatedTransaction = await Transaction.findById(transaction._id)
        .populate('buyer', 'email gameIds')
        .populate('seller', 'email')
        .populate('item');

      res.json({ 
        verified: true,
        message: 'Payment successful! The seller will transfer the item to your game account.',
        transaction: {
          ...updatedTransaction.toObject(),
          gameDetails: updatedTransaction.gameDetails
        }
      });
    } else {
      await Transaction.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'failed' }
      );
      
      res.status(400).json({ 
        verified: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});

// Get user's transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { buyer: req.user.userId },
        { seller: req.user.userId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('item')
    .populate('buyer', 'email gameIds')
    .populate('seller', 'email');

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      message: 'Failed to get transactions',
      error: error.message 
    });
  }
});

// Mark transaction as transferred
router.put('/transactions/:id/transfer', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: req.params.id,
        seller: req.user.userId,
        status: 'completed',
        itemTransferred: { $ne: true }
      },
      { itemTransferred: true },
      { new: true }
    )
    .populate('buyer', 'email gameIds')
    .populate('item')
    .populate('seller', 'email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or already transferred' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Transfer status update error:', error);
    res.status(500).json({ message: 'Failed to update transfer status' });
  }
});

export default router;