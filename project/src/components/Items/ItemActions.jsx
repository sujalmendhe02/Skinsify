import React, { useState } from 'react';
import RazorpayButton from '../Payment/RazorpayButton';
import useAuthStore from '../../store/authStore';

const ItemActions = ({ item, onPurchaseSuccess }) => {
  const [showChat, setShowChat] = useState(false);
  const user = useAuthStore((state) => state.user);

  

  return (
    <div className="space-y-4">
      <RazorpayButton
        amount={item.price}
        itemId={item._id}
        itemName={item.name}
        sellerId={item.sellerId}
        gameType={item.game}
        onSuccess={onPurchaseSuccess}
      />
      
      
      
    </div>
  );
};

export default ItemActions;