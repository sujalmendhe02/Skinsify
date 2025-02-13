import React from 'react';
import { Link } from 'react-router-dom';
import DeleteItemButton from './DeleteItemButton';
import useAuthStore from '../../store/authStore';

const ItemCard = ({ item, onDelete, showDelete = false }) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user && item.sellerId === user.id;

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200">
      <Link to={`/item/${item._id}`}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/item/${item._id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-cyan-400">{item.name}</h3>
          </Link>
          {showDelete && isOwner && (
            <DeleteItemButton itemId={item._id} onDelete={onDelete} />
          )}
        </div>
        <p className="text-gray-400 text-sm mb-2">{item.game}</p>
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold">₹{item.price}</span>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 bg-gray-600 rounded-full ${
              item.rarity === 'Mythic' ? 'text-pink-400' :
              item.rarity === 'Legendary' ? 'text-yellow-400' :
              'text-cyan-400'
            }`}>
              {item.rarity}
            </span>
            <span className={`text-xs px-2 py-1 bg-gray-600 rounded-full ${
              item.quantity === 0 ? 'text-red-400' : 'text-green-400'
            }`}>
              {item.quantity === 0 ? 'Out of Stock' : `${item.quantity} left`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;