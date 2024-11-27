import express from 'express';
import Razorpay from 'razorpay';
import auth from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_VTeHEBn3aNjFQV',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'XgWhkUAIqIkH6btlq6UTb7ak',
});

router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Payment error' });
    
  }
});

// const crypto = require('crypto');

router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    


    const generated_signature = crypto
      .createHmac('sha256', 'XgWhkUAIqIkH6btlq6UTb7ak'  || process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error' });
    console.error('Error details:', error.response ? error.response.data : error.message);
  }
});

export default router;