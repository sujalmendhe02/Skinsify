import express from 'express';
import Game from '../models/Game.js';
import { demoGames } from '../data/demoData.js';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Failed to fetch games' });
  }
});

// Initialize demo games
router.post('/init', async (req, res) => {
  try {
    const count = await Game.countDocuments();
    if (count === 0) {
      // Drop existing indexes to prevent conflicts
      await Game.collection.dropIndexes();
      
      // Insert demo games
      const games = await Game.insertMany(demoGames);
      console.log('Demo games initialized successfully');
      res.status(201).json({ 
        message: 'Demo games initialized',
        games 
      });
    } else {
      const games = await Game.find();
      res.json({ 
        message: 'Games already exist',
        games 
      });
    }
  } catch (error) {
    console.error('Demo games initialization error:', error);
    res.status(500).json({ message: 'Failed to initialize demo games' });
  }
});

export default router;