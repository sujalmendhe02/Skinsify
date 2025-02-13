import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';
import { persistAuth, verifyToken } from '../lib/auth';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      signIn: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          persistAuth(token, user);
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
          persistAuth(token, user);
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
        localStorage.removeItem('user');
        set({ user: null });
        toast.success('Logged out successfully');
      },
      setUser: (user) => set({ user, loading: false }),
      initAuth: async () => {
        try {
          const user = await verifyToken();
          set({ user, loading: false });
        } catch (error) {
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;