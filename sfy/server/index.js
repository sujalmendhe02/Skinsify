import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import gameRoutes from './routes/games.js';
import feedbackRoutes from './routes/feedback.js';
import paymentRoutes from './routes/payment.js';
import messageRoutes from './routes/messages.js';
import { demoGames } from './data/demoData.js';
import Game from './models/Game.js';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcrqbc5zb',
  api_key: process.env.CLOUDINARY_API_KEY || '121748632359686' ,
  api_secret: process.env.CLOUDINARY_API_SECRET || 'RpCEs2nI-V_mSgs8PfIBz86J4MY'
});

const checkCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('Connected to Cloudinary:', result); 
  } catch (error) {
    console.error('Failed to connect to Cloudinary:', error);
    console.error('Error details:', error.response ? error.response.data : error.message);
  }
};


checkCloudinaryConnection();


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
   
    try {
      const gamesCount = await Game.countDocuments();
      if (gamesCount === 0) {
        await Game.insertMany(demoGames);
        console.log('Demo games initialized');
      }
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});