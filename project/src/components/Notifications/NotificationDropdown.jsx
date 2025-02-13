import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/payment/transactions');
        const pendingTransfers = response.data.filter(
          t => t.seller?._id === user.id && 
          t.status === 'completed' && 
          !t.itemTransferred &&
          t.item // Ensure item exists
        );

        setNotifications(pendingTransfers);
        setUnreadCount(pendingTransfers.length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const markAsTransferred = async (transactionId) => {
    try {
      setLoading(true);
      await api.put(`/payment/transactions/${transactionId}/transfer`);
      
      // Update local state
      setNotifications(prev => prev.filter(n => n._id !== transactionId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Item marked as transferred');
    } catch (error) {
      console.error('Failed to mark as transferred:', error);
      toast.error('Failed to update transfer status');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Pending Transfers</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="px-4 py-3 hover:bg-gray-700 border-b border-gray-700 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">
                        Transfer {notification.item?.name || 'Item'} to {notification.buyer?.email || 'Buyer'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Game ID: {notification.gameDetails?.gameId || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Game: {notification.gameDetails?.gameType || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      onClick={() => markAsTransferred(notification._id)}
                      disabled={loading}
                      className={`px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed`}
                    >
                      {loading ? 'Updating...' : 'Mark as Transferred'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center">
                No pending transfers
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;