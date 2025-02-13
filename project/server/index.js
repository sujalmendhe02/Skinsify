import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import gameRoutes from './routes/games.js';
import feedbackRoutes from './routes/feedback.js';
import paymentRoutes from './routes/payment.js';
import { demoGames } from './data/demoData.js';
import Game from './models/Game.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
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


app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/games', gameRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/payment', paymentRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});