import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  }
});

gameSchema.index({ name: 1 });
gameSchema.index({ slug: 1 });

export default mongoose.model('Game', gameSchema);