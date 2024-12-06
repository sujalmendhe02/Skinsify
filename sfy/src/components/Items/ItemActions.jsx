import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import RazorpayButton from '../Payment/RazorpayButton';
import ChatModal from '../Messages/ChatModal';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ItemActions = ({ item, onPurchaseSuccess }) => {
  const [showChat, setShowChat] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact the seller');
      return;
    }
    setShowChat(true);
  };

  return (
    <div className="space-y-4">
      <RazorpayButton
        amount={item.price}
        itemId={item._id}
        itemName={item.name}
        sellerId={item.sellerId}
        onSuccess={onPurchaseSuccess}
      />
      
      <button
        onClick={handleContactSeller}
        className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-white rounded-lg py-2 hover:bg-gray-600 transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Contact Seller</span>
      </button>

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        receiverId={item.sellerId}
        itemId={item._id}
        itemName={item.name}
      />
    </div>
  );
};

export default ItemActions;