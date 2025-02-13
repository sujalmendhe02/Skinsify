import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, DollarSign, Users, Package, Star } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeListings: 0,
    totalCustomers: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, itemsRes, feedbackRes] = await Promise.all([
          api.get('/payment/transactions'),
          api.get('/items/user/items'),
          api.get(`/feedback/stats/${user.id}`)
        ]);

        // Filter completed sales where user is the seller
        const completedSales = transactionsRes.data.filter(
          t => t.seller?._id === user.id && t.status === 'completed' && t.item
        );

        // Calculate stats
        const totalSales = completedSales.reduce((sum, t) => sum + t.amount, 0);
        const uniqueCustomers = new Set(completedSales.map(t => t.buyer?._id).filter(Boolean)).size;

        setTransactions(completedSales);
        setStats({
          totalSales,
          activeListings: itemsRes.data.length,
          totalCustomers: uniqueCustomers,
          avgRating: feedbackRes.data.averageRating || 0
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: DollarSign
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: Package
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users
    },
    {
      title: 'Avg. Rating',
      value: stats.avgRating.toFixed(1),
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">Game ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="text-white">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        {transaction.item?.imageUrl && (
                          <img
                            src={transaction.item.imageUrl}
                            alt={transaction.item?.name || 'Item'}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span>{transaction.item?.name || 'Item'}</span>
                      </div>
                    </td>
                    <td className="py-3">{transaction.buyer?.email || 'Unknown Buyer'}</td>
                    <td className="py-3">{transaction.gameDetails?.gameId || 'N/A'}</td>
                    <td className="py-3">₹{transaction.amount}</td>
                    <td className="py-3">
                      {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      No sales yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;