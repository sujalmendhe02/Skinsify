import express from 'express';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, itemId, content } = req.body;
    
    const message = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      itemId,
      content
    });

    await message.save();
    
    // Populate sender and receiver details
    await message.populate('sender', 'email');
    await message.populate('receiver', 'email');
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get conversation
router.get('/conversation/:userId/:itemId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: req.params.userId, itemId: req.params.itemId },
        { sender: req.params.userId, receiver: req.user.userId, itemId: req.params.itemId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'email')
    .populate('receiver', 'email')
    .populate('itemId', 'name');

    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// Get all conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.userId },
            { receiver: req.user.userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            itemId: '$itemId',
            otherUser: {
              $cond: {
                if: { $eq: ['$sender', req.user.userId] },
                then: '$receiver',
                else: '$sender'
              }
            }
          },
          lastMessage: { $last: '$content' },
          updatedAt: { $max: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', req.user.userId] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);

    // Populate user and item details
    const populatedConversations = await Message.populate(conversations, [
      { path: '_id.otherUser', select: 'email' },
      { path: '_id.itemId', select: 'name imageUrl' }
    ]);

    res.json(populatedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to get conversations' });
  }
});

// Mark messages as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user.userId,
        read: false
      },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
});

export default router;