import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, TrendingUp } from 'lucide-react';

const ShopCard = ({ shop, showDistance = true }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-500/50 text-yellow-500" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />);
    }
    
    return stars;
  };

  return (
    <Link to={`/shop/${shop.id}`} className="block">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 hover:bg-gray-900/70 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105 group flex flex-col w-full max-w-[320px] min-w-[280px] min-h-[340px] h-full mx-auto">
        
        {/* Shop Header - Fixed Height */}
        <div className="flex flex-col mb-4 min-h-[80px]">
          {/* Shop Name - Fixed Height Container */}
          <div className="min-h-[56px] flex flex-col items-start w-full">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors font-serif line-clamp-2 leading-7 w-full">
              {shop.name}
            </h3>
            <div className="flex items-center space-x-1 bg-green-900/30 px-2 py-1 rounded-full mt-2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm text-green-400">{shop.rating}</span>
            </div>
          </div>
          {/* Location - Fixed Height */}
          <div className="flex items-center space-x-2 mt-2 min-h-[20px] w-full">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 truncate w-full">{shop.state}</span>
            {showDistance && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400 flex-shrink-0">{shop.distance} km</span>
              </>
            )}
          </div>
        </div>

        {/* Price Section - Fixed Height */}
        <div className="grid grid-cols-2 gap-4 mb-4 flex-grow min-h-[120px]">
          <div className="bg-black/30 rounded-lg p-3 border border-yellow-500/10 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">22K Gold</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-400 bg-yellow-600/20 px-2 py-0.5 rounded">22K</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="text-xl font-bold text-yellow-500 font-mono">₹{shop.goldPrices.price22K}</div>
              <div className="text-xs text-gray-500">/gram</div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 border border-yellow-500/10 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">24K Gold</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-400 bg-yellow-600/20 px-2 py-0.5 rounded">24K</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="text-xl font-bold text-yellow-500 font-mono">₹{shop.goldPrices.price24K}</div>
              <div className="text-xs text-gray-500">/gram</div>
            </div>
          </div>
        </div>

        {/* Last Updated - Fixed Height */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 min-h-[20px] mt-auto">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Updated {shop.goldPrices.lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;