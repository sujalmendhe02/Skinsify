import React from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const GameIdForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      csgo: user?.gameIds?.csgo || '',
      valorant: user?.gameIds?.valorant || '',
      pubgBgmi: user?.gameIds?.pubgBgmi || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.put('/auth/update-game-ids', {
        gameIds: {
          csgo: data.csgo,
          valorant: data.valorant,
          pubgBgmi: data.pubgBgmi
        }
      });

      setUser(response.data);
      toast.success('Game IDs updated successfully');
    } catch (error) {
      toast.error('Failed to update game IDs');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Game IDs</h3>
      
      <div>
        <label className="block text-gray-300 mb-2">CS:GO ID</label>
        <input
          {...register('csgo')}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          placeholder="Enter your CS:GO ID"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Valorant ID</label>
        <input
          {...register('valorant')}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          placeholder="Enter your Valorant ID"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">PUBG/BGMI ID</label>
        <input
          {...register('pubgBgmi')}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          placeholder="Enter your PUBG/BGMI ID"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors flex items-center justify-center"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Game IDs
      </button>
    </form>
  );
};

export default GameIdForm;