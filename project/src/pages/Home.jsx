import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description }) => (
  <div className="relative">
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
      {icon}
    </div>
    <p className="ml-16 text-lg leading-6 font-medium text-white">{title}</p>
    <p className="mt-2 ml-16 text-base text-gray-300">
      {description}
    </p>
  </div>
);

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Your Ultimate</span>
                  <span className="block text-cyan-400">Gaming Marketplace</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Buy, sell, and trade virtual items from your favorite games. From rare skins to exclusive items, find everything you need in one place.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/marketplace"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 md:py-4 md:text-lg md:px-10"
                    >
                      Browse Marketplace
                      <ArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Gaming Setup"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need in one place
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-cyan-400" />}
                title="Exclusive Items"
                description="Access rare and exclusive in-game items from popular games"
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-cyan-400" />}
                title="Secure Trading"
                description="Safe and secure transactions with our escrow system"
              />
              <FeatureCard
                icon={<Coins className="h-6 w-6 text-cyan-400" />}
                title="Multiple Payment Options"
                description="Support for various payment methods including PayPal and Razorpay"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;