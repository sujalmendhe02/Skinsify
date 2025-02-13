import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Star, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ItemCard from '../components/Items/ItemCard';
import StatCard from '../components/Stats/StatCard';
import GameIdForm from '../components/Profile/GameIdForm';
import useUserItems from '../hooks/useUserItems';
import api from '../lib/axios';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, loading: itemsLoading, deleteItem } = useUserItems();
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get(`/feedback/stats/${user.id}`);
        setStats({
          avgRating: response.data.averageRating || 0,
          totalReviews: response.data.totalFeedbacks || 0
        });
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const profileStats = [
    {
      title: 'Listed Items',
      value: items.length,
      icon: Package,
    },
    {
      title: 'Average Rating',
      value: `${stats.avgRating.toFixed(1)} (${stats.totalReviews} reviews)`,
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
              {profileStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="mt-8">
              <GameIdForm />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Your Listed Items</h2>
              {itemsLoading || loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <ItemCard 
                      key={item._id} 
                      item={item} 
                      showDelete={true}
                      onDelete={deleteItem}
                    />
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