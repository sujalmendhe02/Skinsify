import React from 'react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const RazorpayButton = ({ amount, itemId, itemName, onSuccess }) => {
  const user = useAuthStore((state) => state.user);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    try {
      const { data: order } = await api.post('/payment/create-order', { amount });

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Skinsify',
        description: `Purchase ${itemName}`,
        order_id: order.id,
        handler: async function(response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment successful!');
            onSuccess();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          email: user.email
        },
        theme: {
          color: '#0891b2' 
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-cyan-600 text-white rounded-lg py-3 hover:bg-cyan-700 transition-colors"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayButton;