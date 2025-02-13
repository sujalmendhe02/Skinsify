import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  itemTransferred: {
    type: Boolean,
    default: false
  },
  paymentId: String,
  orderId: String,
  gameDetails: {
    gameId: {
      type: String,
      required: true
    },
    gameType: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);