import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;