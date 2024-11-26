import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <Link to={`/item/${item._id}`}>
      <div className="bg-gray-700 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{item.game}</p>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">₹{item.price}</span>
            <span className={`text-xs px-2 py-1 bg-gray-600 rounded-full ${
              item.rarity === 'Mythic' ? 'text-pink-400' :
              item.rarity === 'Legendary' ? 'text-yellow-400' :
              'text-cyan-400'
            }`}>
              {item.rarity}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;