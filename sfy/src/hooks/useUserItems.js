import { useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useUserItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/user/items');
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user items:', error);
      setError('Failed to load your items');
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Delete item error:', error);
      toast.error('Failed to delete item');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    refreshItems: fetchItems,
    deleteItem
  };
};

export default useUserItems;