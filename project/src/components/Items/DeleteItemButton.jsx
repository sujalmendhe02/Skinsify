import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const DeleteItemButton = ({ itemId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/items/${itemId}`);
      toast.success('Item deleted successfully');
      onDelete(itemId);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-colors"
      title="Delete item"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
};

export default DeleteItemButton;