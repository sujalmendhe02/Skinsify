import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ReactPlayer from 'react-player';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const games = ['CS:GO', 'Valorant', 'PUBG/BGMI'];
const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

const UploadModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!selectedImage || !user) {
      toast.error('Please select an image and ensure you are logged in');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', selectedImage);
      if (selectedVideo) {
        formData.append('video', selectedVideo);
      }
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('quantity', data.quantity);
      formData.append('game', data.game);
      formData.append('rarity', data.rarity);

      await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Item uploaded successfully!');
      reset();
      setSelectedImage(null);
      setSelectedVideo(null);
      setVideoPreview(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Upload Item</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Item Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              {...register('quantity', { 
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' }
              })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            />
            {errors.quantity && (
              <p className="text-red-400 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Game</label>
            <select
              {...register('game', { required: 'Game selection is required' })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            >
              <option value="">Select a game</option>
              {games.map((game) => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
            {errors.game && (
              <p className="text-red-400 text-sm mt-1">{errors.game.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Rarity</label>
            <select
              {...register('rarity', { required: 'Rarity is required' })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            >
              <option value="">Select rarity</option>
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
            {errors.rarity && (
              <p className="text-red-400 text-sm mt-1">{errors.rarity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Price (₹)</label>
            <input
              type="number"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Image (Required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Video (Optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
            />
            {videoPreview && (
              <div className="mt-2">
                <ReactPlayer
                  url={videoPreview}
                  width="100%"
                  height="200px"
                  controls
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;