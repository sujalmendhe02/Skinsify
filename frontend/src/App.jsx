import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const user = await response.json();
            setUser(user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      };
      verifyToken();
    } else {
      setUser(null);
    }
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/item/:id" element={<ItemDetails />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;