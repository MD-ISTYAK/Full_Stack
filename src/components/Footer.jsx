import React from 'react';
import { Crown, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-yellow-500/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-500 font-serif">GoldCompare</h3>
                <p className="text-xs text-gray-400">Singapore</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Singapore's premier gold price comparison platform. Find the best deals on 916 and 999 gold from trusted jewelry shops across the island.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">All Shops</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Best Prices</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Districts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Price Comparison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Shop Reviews</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Live Updates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Market Analysis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Investment Guide</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-400">Marina Bay, Singapore</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-400">+65 6123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-400">info@goldcompare.sg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 GoldCompare Singapore. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;