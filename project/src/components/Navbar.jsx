import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Upload, LogOut, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import LoginModal from './Auth/LoginModal';
import SignupModal from './Auth/SignupModal';
import UploadModal from './ItemUpload/UploadModal';
import NotificationDropdown from './Notifications/NotificationDropdown';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <Logo className="h-8 w-auto" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                  <Link to="/marketplace" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Marketplace</Link>
                  {user && (
                    <>
                      <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                      <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <Search className="h-6 w-6" />
                </button>
                {user ? (
                  <>
                    <NotificationDropdown />
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="ml-3 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <Upload className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="ml-3 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/marketplace" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Marketplace</Link>
              {user && (
                <>
                  <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                  <NotificationDropdown />
                </>
              )}
              {user ? (
                <>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Upload Item
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
};

export default Navbar;