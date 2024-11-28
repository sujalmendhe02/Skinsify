import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, DollarSign, Users, Package, Star } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    navigate('/');
    return null;
  }

  const stats = [
    {
      title: 'Total Sales',
      value: '₹15,000',
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Listings',
      value: '23',
      icon: Package,
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Total Customers',
      value: '48',
      icon: Users,
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: BarChart,
      change: '+0.2',
      changeType: 'positive'
    }
  ];

  const recentSales = [
    {
      name: 'Dragon Lore AWP',
      time: '2 hours ago',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Reaver Vandal',
      time: '5 hours ago',
      price: 1000,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Glacier M416',
      time: '1 day ago',
      price: 800,
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
              <div className={`mt-2 flex items-center text-sm ${
                stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
                <span className="text-gray-400 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={sale.image} 
                      alt={sale.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-white font-medium">{sale.name}</p>
                      <p className="text-gray-400 text-sm">{sale.time}</p>
                    </div>
                  </div>
                  <p className="text-cyan-400 font-bold">₹{sale.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">User123</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Great seller! Fast delivery and item was exactly as described.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;