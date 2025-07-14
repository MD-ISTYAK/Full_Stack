import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, MapPin, Clock } from 'lucide-react';

const BestPriceCard = ({ shop, goldType, price, label }) => {
  return (
    <Link to={`/shop/${shop.id}`}>
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 hover:from-gray-900/90 hover:to-gray-800/90 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 group">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-medium text-yellow-500">{label}</span>
          </div>
          <div className="bg-green-900/30 px-3 py-1 rounded-full">
            <span className="text-xs text-green-400 font-medium">Best Price</span>
          </div>
        </div>

        {/* Shop Name */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors font-serif">
          {shop.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-3xl font-bold text-yellow-500 font-mono">₹{price}</span>
          <span className="text-sm text-gray-400">/gram</span>
          <div className="bg-yellow-600/20 px-2 py-1 rounded">
            <span className="text-xs text-yellow-300 font-medium">{goldType === '916' ? '22K' : goldType === '999' ? '24K' : goldType}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{shop.state}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Updated {shop.goldPrices.lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
};

export default BestPriceCard;