import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-2 text-gray-300 text-sm">
              Your trusted marketplace for gaming virtual goods.
              Buy, sell, and trade with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/marketplace" className="text-base text-gray-300 hover:text-white">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Connect
            </h3>
            <div className="flex space-x-6 mt-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Skinsify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;