import express from 'express';
import multer from 'multer';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { demoItems } from '../data/demoData.js';

const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcrqbc5zb',
  api_key: process.env.CLOUDINARY_API_KEY || '121748632359686' ,
  api_secret: process.env.CLOUDINARY_API_SECRET || 'RpCEs2nI-V_mSgs8PfIBz86J4MY'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skinsify',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'webm']
  }
});

const upload = multer({ storage });

router.post('/init', async (req, res) => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany(demoItems);
      res.status(201).json({ message: 'Demo items initialized' });
    } else {
      res.json({ message: 'Items already exist' });
    }
  } catch (error) {
    console.error('Demo items initialization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { game, search, sort = 'price' } = req.query;
    let query = {};

    if (game) {
      query.game = game;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {
      price: { price: 1 },
      'price-desc': { price: -1 },
      name: { name: 1 },
      rarity: { rarity: 1 }
    };

    const items = await Item.find(query)
      .sort(sortOptions[sort] || sortOptions.price);

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/user', auth, async (req, res) => {
  try {
    const items = await Item.find({ sellerId: req.user.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); 
    if (!item) {
      return res.status(404).json({ message: 'Item not found' }); 
    }
    res.json(item); 
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { name, description, price, game, rarity } = req.body;

    if (!name || !description || !price || !game || !rarity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Files received:', req.files);

    const item = new Item({
      name,
      description,
      price: Number(price),
      game,
      rarity,
      sellerId: req.user.userId,
      imageUrl: req.files.image[0].path, 
      videoUrl: req.files.video?.[0]?.path 
    });

    await item.save();

    res.status(201).json(item);

  } catch (error) {
    console.error('Upload error:', error); 
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
});



export default router;
