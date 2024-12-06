import api from './axios';

export const initializePayment = async ({ amount, itemId, sellerId, email }) => {
  try {
    const { data: order } = await api.post('/payment/create-order', { 
      amount,
      itemId,
      sellerId
    });

    if (!order || !order.id) {
      throw new Error('Invalid order response from server');
    }

    const options = {
      key: 'rzp_test_VTeHEBn3aNjFQV', // Replace with your actual Razorpay key
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Skinsify',
      description: 'Gaming Item Purchase',
      order_id: order.id,
      prefill: {
        email: email
      },
      theme: {
        color: '#0891b2'
      }
    };

    return { order, options };
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw new Error('Failed to initialize payment');
  }
};


export const verifyPayment = async (paymentData) => {
  try {
    // Using paymentData correctly here
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    await api.post('/payment/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
    
    // Assuming this is on success from Razorpay callback
    toast.success('Payment successful!');
    // You should call onSuccess here, but ensure `onSuccess` is passed properly
  } catch (error) {
    console.error('Payment verification error:', error);
    toast.error('Payment verification failed');
  }
};

