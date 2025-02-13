import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { initializePayment, verifyPayment } from '../../lib/payment';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const RazorpayButton = ({ amount, itemId, itemName, sellerId, gameType, onSuccess }) => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const validateGameId = () => {
    // Convert game type to the correct gameIds key
    const gameKeyMap = {
      'CS:GO': 'csgo',
      'PUBG/BGMI': 'pubgBgmi',
      'Valorant': 'valorant'
    };
    
    const gameKey = gameKeyMap[gameType];
    if (!gameKey) {
      toast.error('Invalid game type');
      return false;
    }

    const gameId = user?.gameIds?.[gameKey];
    if (!gameId) {
      toast.error(`Please add your ${gameType} game ID in your profile first`);
      return false;
    }
    return gameId;
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    const gameId = validateGameId();
    if (!gameId) {
      return;
    }

    try {
      setLoading(true);
      const { options } = await initializePayment({
        amount,
        itemId,
        sellerId,
        email: user.email,
        gameId,
        gameType
      });

      const razorpay = new window.Razorpay({
        ...options,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment successful! The seller will transfer the item to your game account.');
            onSuccess();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-cyan-600 text-white rounded-lg py-3 hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading ? (
        <>
          <Loader className="animate-spin h-5 w-5 mr-2" />
          Processing...
        </>
      ) : (
        `Pay ₹${amount}`
      )}
    </button>
  );
};

export default RazorpayButton;