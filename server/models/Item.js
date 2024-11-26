import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  game: {
    type: String,
    required: [true, 'Game is required'],
    enum: ['CS:GO', 'Valorant', 'PUBG/BGMI']
  },
  rarity: {
    type: String,
    required: [true, 'Rarity is required'],
    enum: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Premium']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  videoUrl: {
    type: String
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.index({ game: 1 });
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ price: 1 });
itemSchema.index({ rarity: 1 });

export default mongoose.model('Item', itemSchema);