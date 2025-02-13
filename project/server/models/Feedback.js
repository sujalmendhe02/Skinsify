import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid item ID'
    }
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid seller ID'
    }
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid buyer ID'
    }
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: true,
    minlength: [10, 'Review must be at least 10 characters long'],
    trim: true
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
feedbackSchema.index({ itemId: 1, buyerId: 1 }, { unique: true });
feedbackSchema.index({ sellerId: 1 });
feedbackSchema.index({ rating: 1 });

export default mongoose.model('Feedback', feedbackSchema);