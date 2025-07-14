import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Menu, X, Store } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-500 font-serif">GoldCompare</h1>
              <p className="text-xs text-gray-400">India</p>
            </div>
          </Link>

          {/* Toggle Switch for Home/All Shops */}
          <div className="hidden md:block">
            <div className="bg-gray-800 p-1 rounded-lg flex">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>Home</span>
              </Link>
              <Link
                to="/shops"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  isActive('/shops') 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>All Shops</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-yellow-500 hover:bg-gray-700 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-yellow-500/20">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className={`block text-sm font-medium transition-colors ${
                isActive('/') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shops"
              className={`block text-sm font-medium transition-colors ${
                isActive('/shops') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              All Shops
            </Link>
           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;