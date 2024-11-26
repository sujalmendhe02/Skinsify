import express from 'express';
import Game from '../models/Game.js';
import { demoGames } from '../data/demoData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/init', async (req, res) => {
  try {
    const count = await Game.countDocuments();
    if (count === 0) {
      await Game.insertMany(demoGames);
      res.status(201).json({ message: 'Demo games initialized' });
    } else {
      res.json({ message: 'Games already exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;