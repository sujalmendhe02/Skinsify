import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import ReactPlayer from 'react-player';
import RazorpayButton from '../components/Payment/RazorpayButton';
import FeedbackForm from '../components/Feedback/FeedbackForm'; 
import { useAuthStore } from '../store/authStore'; 
import toast from 'react-hot-toast'; 
import api from '../lib/axios'; 

const ItemDetails = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); 
  const user = useAuthStore((state) => state.user); 

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data); 
      } catch (error) {
        console.error('Error fetching item details:', error);
        toast.error('Failed to load item details');
      } finally {
        setLoading(false); 
      }
    };

    fetchItemDetails();
  }, [id]);
  
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  
  if (!item) {
    return <div className="text-white">Item not found</div>;
  }

  const handlePaymentSuccess = () => {
    toast.success('Purchase successful!');
    setShowFeedbackForm(true); 
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/marketplace"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Marketplace
        </Link>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        
            <div>
              <img
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-auto rounded-lg mb-4"
              />
              {item.videoUrl && ( 
                <div className="mt-4">
                  <ReactPlayer
                    url={item.videoUrl}
                    width="100%"
                    height="300px"
                    controls
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>
              <p className="text-gray-400 mb-6">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Game</p>
                  <p className="text-white font-semibold">{item.game}</p>
                </div>
                <div>
                  <p className="text-gray-400">Rarity</p>
                  <p className="text-white font-semibold">{item.rarity}</p>
                </div>
                <div>
                  <p className="text-gray-400">Condition</p>
                  <p className="text-white font-semibold">{item.condition}</p>
                </div>
                <div>
                  <p className="text-gray-400">Listed</p>
                  <p className="text-white font-semibold">{item.listed}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400">Price</p>
                    <p className="text-white font-semibold">{item.price} USD</p>
                  </div>
                  <div className="border-t border-gray-700 py-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-gray-400 mb-1">Price</p>
                        <p className="text-3xl font-bold text-white">₹{item.price}</p>
                      </div>
                      <RazorpayButton
                        amount={item.price}
                        itemId={item.id}
                        itemName={item.name}
                        onSuccess={handlePaymentSuccess}
                      />
                    </div>

                    <div className="flex items-center text-gray-400">
                      <Shield className="h-5 w-5 mr-2" />
                      <span>Secure transaction with Razorpay payment protection</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {showFeedbackForm && <FeedbackForm itemId={item.id} />}
      </div>
    </div>
  );
};

export default ItemDetails;
