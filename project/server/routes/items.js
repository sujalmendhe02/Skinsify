import express from 'express';
import multer from 'multer';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { demoItems } from '../data/demoData.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Verify Cloudinary credentials are available
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error('Missing required Cloudinary configuration');
}

// Configure Cloudinary with explicit credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Cloudinary storage with explicit configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skinsify',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'webm'],
    resource_type: 'auto'
  }
});

// Configure multer with simpler settings
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

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
      .populate('sellerId', 'email')
      .lean()
      .exec();

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
      .populate('sellerId', 'email')
      .lean()
      .exec();
    
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
    const items = await Item.find({ sellerId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json(items);
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Failed to fetch your items' });
  }
});

// Upload new item with optimized upload handling
router.post('/', auth, (req, res) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, description, price, game, rarity, quantity } = req.body;
      
      if (!req.files?.image?.[0]) {
        return res.status(400).json({ message: 'Image is required' });
      }

      const imageUrl = req.files.image[0].path;
      if (!imageUrl) {
        throw new Error('Image upload failed - no URL returned');
      }

      const videoUrl = req.files.video?.[0]?.path;

      const item = new Item({
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        game,
        rarity,
        sellerId: req.user.userId,
        imageUrl,
        videoUrl: videoUrl || undefined
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      console.error('Upload error:', error);
      
      const cleanup = async () => {
        if (req.files?.image?.[0]?.public_id) {
          try {
            await cloudinary.uploader.destroy(req.files.image[0].public_id);
          } catch (cleanupError) {
            console.error('Image cleanup error:', cleanupError);
          }
        }
        if (req.files?.video?.[0]?.public_id) {
          try {
            await cloudinary.uploader.destroy(req.files.video[0].public_id, { resource_type: 'video' });
          } catch (cleanupError) {
            console.error('Video cleanup error:', cleanupError);
          }
        }
      };

      await cleanup();
      res.status(500).json({ message: error.message || 'Failed to upload item' });
    }
  });
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

    // Delete files from Cloudinary in parallel
    const deletePromises = [];
    
    if (item.imageUrl) {
      const publicId = item.imageUrl.split('/').pop().split('.')[0];
      deletePromises.push(cloudinary.uploader.destroy(`skinsify/${publicId}`));
    }
    
    if (item.videoUrl) {
      const publicId = item.videoUrl.split('/').pop().split('.')[0];
      deletePromises.push(cloudinary.uploader.destroy(`skinsify/${publicId}`, { resource_type: 'video' }));
    }

    await Promise.all(deletePromises);
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
      const items = await Item.find().lean().exec();
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

