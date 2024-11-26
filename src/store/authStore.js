import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user });
      toast.success('Successfully logged in!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  },
  signUp: async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user });
      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },
  signOut: () => {
    localStorage.removeItem('token');
    set({ user: null });
    toast.success('Logged out successfully');
  },
  setUser: (user) => set({ user, loading: false }),
}));

export default useAuthStore;