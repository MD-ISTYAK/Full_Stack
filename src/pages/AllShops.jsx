import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Navigation, ChevronDown, ChevronUp, X } from 'lucide-react';
import { generateShops, districts } from '../data/dataLoader';
import { useLocation } from '../context/LocationContext';
import { sortShopsByDistance } from '../utils/distanceUtils';
import ShopCard from '../components/ShopCard';
import GoldDecorations from '../components/GoldDecorations';

const AllShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('shop');
  const [selectedGoldType, setSelectedGoldType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [displayedShops, setDisplayedShops] = useState(8);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [shopNames, setShopNames] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showMoreVisible, setShowMoreVisible] = useState(false);

  const { userLocation, isNearbyMode, toggleNearbyMode, setManualLocation } = useLocation();

  // Use districts from dataLoader
  const singaporeLocations = districts;

  useEffect(() => {
    const generatedShops = generateShops();
    setShops(generatedShops);
    setFilteredShops(generatedShops.slice(0, displayedShops));
    setTotalResults(generatedShops.length);
    setShowMoreVisible(generatedShops.length > displayedShops);
    
    // Extract unique shop names for search suggestions
    const uniqueShopNames = [...new Set(generatedShops.map(shop => shop.name))].sort();
    setShopNames(uniqueShopNames);
  }, []);

  useEffect(() => {
    let filtered = [...shops];

    // Apply search filter only if user has searched
    if (hasSearched && searchTerm.trim()) {
      if (searchType === 'location') {
        // Location search - prefix match on district
        filtered = filtered.filter(shop => 
          shop.district.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      } else {
        // Shop name search - prefix match on shop name
        filtered = filtered.filter(shop => 
          shop.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      }
    }

    // Apply gold type filter
    if (selectedGoldType !== 'all') {
      if (selectedGoldType === '916') {
        filtered = filtered.filter(shop => shop.goldPrices.price916 > 0);
      } else if (selectedGoldType === '999') {
        filtered = filtered.filter(shop => shop.goldPrices.price999 > 0);
      }
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(shop => shop.rating >= minRating);
    }

    // Apply sorting
    if (isNearbyMode && userLocation) {
      // Sort by distance when in nearby mode
      filtered = sortShopsByDistance(filtered, userLocation.latitude, userLocation.longitude);
    } else {
      // Apply other sorting options
      switch (sortBy) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price-low':
          if (selectedGoldType === '916') {
            filtered.sort((a, b) => a.goldPrices.price916 - b.goldPrices.price916);
          } else if (selectedGoldType === '999') {
            filtered.sort((a, b) => a.goldPrices.price999 - b.goldPrices.price999);
          } else {
            filtered.sort((a, b) => Math.min(a.goldPrices.price916, a.goldPrices.price999) - Math.min(b.goldPrices.price916, b.goldPrices.price999));
          }
          break;
        case 'price-high':
          if (selectedGoldType === '916') {
            filtered.sort((a, b) => b.goldPrices.price916 - a.goldPrices.price916);
          } else if (selectedGoldType === '999') {
            filtered.sort((a, b) => b.goldPrices.price999 - a.goldPrices.price999);
          } else {
            filtered.sort((a, b) => Math.max(b.goldPrices.price916, b.goldPrices.price999) - Math.max(a.goldPrices.price916, a.goldPrices.price999));
          }
          break;
        case 'rating-high':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'rating-low':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'distance-near':
          filtered.sort((a, b) => a.distance - b.distance);
          break;
        case 'distance-far':
          filtered.sort((a, b) => b.distance - a.distance);
          break;
        default:
          break;
      }
    }

    setTotalResults(filtered.length);
    const finalShops = filtered.slice(0, displayedShops);
    setFilteredShops(finalShops);
    
    // Pagination logic: After user performs search, if result count ≤ 12, do not display Show More / Show Less buttons
    if (hasSearched && filtered.length <= 12) {
      setShowMoreVisible(false);
    } else {
      setShowMoreVisible(filtered.length > displayedShops);
    }
  }, [searchTerm, searchType, selectedGoldType, sortBy, ratingFilter, shops, hasSearched, displayedShops, isNearbyMode, userLocation]);

  // Handle search input change and generate suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setActiveSuggestionIndex(-1);
    
    if (value.length > 0) {
      let filteredSuggestions = [];
      
      if (searchType === 'location') {
        // Generate alphabetical suggestions for locations
        filteredSuggestions = singaporeLocations
          .filter(location => location.toLowerCase().startsWith(value.toLowerCase()))
          .sort()
          .slice(0, 10);
      } else {
        // Generate alphabetical suggestions for shop names
        filteredSuggestions = shopNames
          .filter(name => name.toLowerCase().startsWith(value.toLowerCase()))
          .sort()
          .slice(0, 10);
      }
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
      setShowSuggestions(false);
      setDisplayedShops(8);
    }
  };

  // Handle suggestion click - instantly fill search bar
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    // Don't trigger search automatically - wait for Search button click
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    if (!isNearbyMode) {
      // Reset to default A-Z view
      setHasSearched(false);
      setSelectedGoldType('all');
      setSortBy('name');
      setRatingFilter('all');
      setDisplayedShops(8);
    } else {
      // If Nearby Me is active, re-trigger previous nearby search
      setHasSearched(true);
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setHasSearched(false);
    setSelectedGoldType('all');
    setSortBy('name');
    setRatingFilter('all');
    setDisplayedShops(8);
  };

  // Handle show more/less functionality
  const handleShowMore = () => {
    setDisplayedShops(prev => prev + 12);
  };

  const handleShowLess = () => {
    setDisplayedShops(8);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedGoldType('all');
    setSortBy('name');
    setRatingFilter('all');
  };

  // Handle nearby me button
  const handleNearbyMe = async () => {
    try {
      if (isNearbyMode) {
        // Deactivate nearby mode
        toggleNearbyMode();
        setSearchTerm('');
        setHasSearched(false);
        setSelectedGoldType('all');
        setSortBy('name');
        setRatingFilter('all');
        setDisplayedShops(8);
      } else {
        // Show manual location input
        const location = prompt('Enter your location (e.g., "Orchard", "Bedok"):');
        if (location && location.trim()) {
          // Set manual location (using district coordinates as approximation)
          const district = districts.find(d => d.toLowerCase().includes(location.toLowerCase()));
          if (district) {
            // Find approximate coordinates for the district
            const districtCoords = {
              'Ang Mo Kio': { lat: 1.3691, lng: 103.8454 },
              'Bedok': { lat: 1.3240, lng: 103.9300 },
              'Bishan': { lat: 1.3521, lng: 103.8198 },
              'Orchard': { lat: 1.3000, lng: 103.8400 },
              'Marina Bay': { lat: 1.2800, lng: 103.8500 },
              'Chinatown': { lat: 1.2800, lng: 103.8300 },
              'Little India': { lat: 1.3000, lng: 103.8500 },
              'Bugis': { lat: 1.3000, lng: 103.8500 },
              'Raffles Place': { lat: 1.2800, lng: 103.8500 },
              'Tanjong Pagar': { lat: 1.2800, lng: 103.8300 }
            };
            
            const coords = districtCoords[district] || { lat: 1.3521, lng: 103.8198 }; // Default to Singapore center
            setManualLocation(coords.lat, coords.lng);
            setSearchTerm(location);
            setHasSearched(true);
            setDisplayedShops(8);
          } else {
            // Use default coordinates for unknown location
            setManualLocation(1.3521, 103.8198);
            setSearchTerm(location);
            setHasSearched(true);
            setDisplayedShops(8);
          }
        }
      }
    } catch (error) {
      console.error('Error setting location:', error);
    }
  };

  // Get dynamic header content
  const getHeaderContent = () => {
    if (isNearbyMode && userLocation && searchTerm.trim()) {
      return {
        title: `Gold Shops Near "${searchTerm}"`,
        subtitle: `${totalResults} shops sorted by distance from your location`
      };
    } else if (isNearbyMode && userLocation && !searchTerm.trim()) {
      return {
        title: "All Gold Shops",
        subtitle: `${totalResults} shops with competitive gold prices`
      };
    } else if (hasSearched && searchTerm.trim()) {
      return {
        title: `Gold Shops Across "${searchTerm}"`,
        subtitle: `${totalResults} shops found`
      };
    } else {
      return {
        title: "All Gold Shops",
        subtitle: `${totalResults} shops with competitive gold prices`
      };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <GoldDecorations />
      
      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              {headerContent.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 block">
                in Singapore
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {headerContent.subtitle}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 mb-8">
            {/* Search Toggle and Nearby Me */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <div className="bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => handleSearchTypeChange('shop')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    searchType === 'shop'
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Search by Shop Name
                </button>
                <button
                  onClick={() => handleSearchTypeChange('location')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    searchType === 'location'
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Search by Location
                </button>
              </div>
              
              <button
                onClick={handleNearbyMe}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  isNearbyMode
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>{isNearbyMode ? 'Nearby Active' : 'Nearby Me'}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchType === 'location' ? 'Search by location...' : 'Search by shop name...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => {
                    if (searchTerm.length > 0 && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                
                {/* Clear button */}
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3 w-5 h-5 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                
                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-2 text-white transition-colors ${
                            index === activeSuggestionIndex 
                              ? 'bg-yellow-500 text-black' 
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">
                        No {searchType === 'location' ? 'locations' : 'shops'} found starting with '{searchTerm}'
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all hover:scale-105"
              >
                Search
              </button>
            </div>

            {/* Filter Options - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Gold Type Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedGoldType('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGoldType === 'all'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedGoldType('916')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGoldType === '916'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  916
                </button>
                <button
                  onClick={() => setSelectedGoldType('999')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGoldType === '999'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  999
                </button>
              </div>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="name">A-Z</option>
                <option value="price-low">Lowest Price</option>
                <option value="price-high">Highest Price</option>
                <option value="rating-high">Rating High to Low</option>
                <option value="rating-low">Rating Low to High</option>
                <option value="distance-near">Nearest First</option>
                <option value="distance-far">Farthest First</option>
              </select>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Reset Filters
              </button>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{totalResults} shops</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          {/* Show More/Less and No Results */}
          {filteredShops.length > 0 ? (
            <>
              {showMoreVisible && (
                <div className="text-center">
                  {displayedShops >= totalResults ? (
                    <button
                      onClick={handleShowLess}
                      className="inline-flex items-center space-x-2 bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all"
                    >
                      <span>Show Less</span>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleShowMore}
                      className="inline-flex items-center space-x-2 bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all"
                    >
                      <span>Show More</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No shops found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllShops;