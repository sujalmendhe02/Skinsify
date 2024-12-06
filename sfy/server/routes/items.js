import express from 'express';
import multer from 'multer';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { demoItems } from '../data/demoData.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skinsify',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'webm']
  }
});

const upload = multer({ storage });

// Get all items with filtering and search
router.get('/', async (req, res) => {
  try {
    const { game, search, sort = 'price', minPrice, maxPrice } = req.query;
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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      price: { price: 1 },
      'price-desc': { price: -1 },
      name: { name: 1 },
      rarity: { rarity: 1 }
    };

    const items = await Item.find(query)
      .sort(sortOptions[sort] || sortOptions.price)
      .populate('sellerId', 'email');

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('sellerId', 'email');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

// Get user's items
router.get('/user/items', auth, async (req, res) => {
  try {
    const items = await Item.find({ sellerId: req.user.userId });
    res.json(Array.isArray(items) ? items : []);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new item
router.post('/', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, price, game, rarity } = req.body;
    
    if (!req.files?.image) {
      return res.status(400).json({ message: 'Image is required' });
    }

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
    res.status(500).json({ message: 'Failed to upload item' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      sellerId: req.user.userId
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    // Delete files from Cloudinary
    if (item.imageUrl) {
      const publicId = item.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`skinsify/${publicId}`);
    }
    
    if (item.videoUrl) {
      const publicId = item.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`skinsify/${publicId}`, { resource_type: 'video' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// Initialize demo items
router.post('/init', async (req, res) => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      const items = await Item.insertMany(demoItems);
      console.log('Demo items initialized successfully');
      res.status(201).json({ 
        message: 'Demo items initialized',
        items 
      });
    } else {
      const items = await Item.find();
      res.json({ 
        message: 'Items already exist',
        items 
      });
    }
  } catch (error) {
    console.error('Demo items initialization error:', error);
    res.status(500).json({ message: 'Failed to initialize demo items' });
  }
});

export default router;