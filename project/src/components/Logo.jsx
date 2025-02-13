import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Logo = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Gamepad2 className="text-cyan-400 mr-2" />
      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Skinsify
      </span>
    </div>
  );
};

export default Logo;