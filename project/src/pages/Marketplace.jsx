import React, { useState, useEffect } from 'react';
import { Search, SortAsc } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import ItemCard from '../components/Items/ItemCard';

const Marketplace = () => {
  const [games, setGames] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Initialize demo data if needed
        await api.post('/games/init');
        await api.post('/items/init');
        
        // Fetch games and items
        const [gamesRes, itemsRes] = await Promise.all([
          api.get('/games'),
          api.get('/items')
        ]);
        
        setGames(gamesRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error('Marketplace error:', err);
        toast.error('Failed to load marketplace data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate effect for filtering and sorting
  useEffect(() => {
    const filterAndSortItems = async () => {
      try {
        const response = await api.get('/items', {
          params: {
            game: selectedGame,
            search: searchQuery,
            sort: sortBy
          }
        });
        setItems(response.data);
      } catch (err) {
        console.error('Filter error:', err);
      }
    };

    filterAndSortItems();
  }, [selectedGame, searchQuery, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game === selectedGame ? '' : game);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Marketplace</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <button
                key={game._id}
                onClick={() => handleGameSelect(game.name)}
                className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors ${
                  selectedGame === game.name ? 'ring-2 ring-cyan-500' : ''
                }`}
                disabled={loading}
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <p className="text-white text-center">{game.name}</p>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">
                No items found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;