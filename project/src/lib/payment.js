import api from './axios';

export const initializePayment = async ({ amount, itemId, sellerId, email, gameId, gameType }) => {
  try {
    const response = await api.post('/payment/create-order', { 
      amount,
      itemId,
      sellerId,
      gameId,
      gameType
    });

    if (!response.data || !response.data.id) {
      throw new Error('Invalid order response from server');
    }

    const options = {
      key: 'rzp_test_VTeHEBn3aNjFQV',
      amount: response.data.amount,
      currency: response.data.currency || 'INR',
      name: 'Skinsify',
      description: 'Gaming Item Purchase',
      order_id: response.data.id,
      prefill: {
        email: email
      },
      theme: {
        color: '#0891b2'
      }
    };

    return { order: response.data, options };
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};