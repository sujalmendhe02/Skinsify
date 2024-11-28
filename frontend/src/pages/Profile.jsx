import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Star, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';
import ItemCard from '../components/Items/ItemCard';
import StatCard from '../components/Stats/StatCard';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserItems = async () => {
      try {
        const response = await api.get('/items/user');
        setUserItems(response.data);
      } catch (error) {
        console.error('Error fetching user items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user, navigate]);

  if (!user) return null;

  const stats = [
    {
      title: 'Listed Items',
      value: userItems.length,
      icon: Package,
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <button className="text-gray-400 hover:text-white">
                <Settings className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Your Listed Items</h2>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : userItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No items listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;