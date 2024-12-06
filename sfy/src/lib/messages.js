import api from './axios';

export const fetchMessages = async (receiverId, itemId) => {
  try {
    const response = await api.get(`/api/messages/conversation/${receiverId}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch messages error:', error);
    throw new Error('Failed to load messages');
  }
};

export const sendMessage = async (receiverId, itemId, content) => {
  try {
    const response = await api.post('/api/messages', {
      receiverId,
      itemId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Send message error:', error);
    throw new Error('Failed to send message');
  }
};

export const markMessagesAsRead = async (senderId) => {
  try {
    await api.put(`/api/messages/read/${senderId}`);
  } catch (error) {
    console.error('Mark messages as read error:', error);
    throw new Error('Failed to mark messages as read');
  }
};

export const fetchConversations = async () => {
  try {
    const response = await api.get('/api/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Fetch conversations error:', error);
    throw new Error('Failed to load conversations');
  }
};