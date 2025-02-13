import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const signUp = useAuthStore((state) => state.signUp);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password);
      toast.success('Account created successfully!');
      reset();
      onClose();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => {
                  if (watch('password') != val) {
                    return "Passwords do not match";
                  }
                },
              })}
              type="password"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded-lg py-2 hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300"
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;