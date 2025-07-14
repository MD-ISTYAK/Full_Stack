import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, TrendingUp, Store, ChevronDown, ChevronUp, Navigation, X } from 'lucide-react';
import { generateShops, districts } from '../data/dataLoader';
import { useLocation } from '../context/LocationContext';
import { sortShopsByDistance } from '../utils/distanceUtils';
import ShopCard from '../components/ShopCard';
import BestPriceCard from '../components/BestPriceCard';
import VisitorAnalytics from '../components/VisitorAnalytics';
import GoldDecorations from '../components/GoldDecorations';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('location');
  const [selectedGoldType, setSelectedGoldType] = useState('all');
  const [sortBy, setSortBy] = useState('price-distance'); // Changed default sort
  const [filteredShops, setFilteredShops] = useState([]);
  const [bestPrices, setBestPrices] = useState({ best916: null, best999: null });
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [displayedShops, setDisplayedShops] = useState(8);
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [shopNames, setShopNames] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { userLocation, isNearbyMode, toggleNearbyMode, locationPermission, setManualLocation } = useLocation();

  // Use districts from dataLoader
  const singaporeLocations = districts;

  // Function to sort shops by price then distance
  const sortByPriceThenDistance = (shopsToSort) => {
    return [...shopsToSort].sort((a, b) => {
      // First, sort by lowest gold price (916 or 999)
      const aMinPrice = Math.min(a.goldPrices.price916 || Infinity, a.goldPrices.price999 || Infinity);
      const bMinPrice = Math.min(b.goldPrices.price916 || Infinity, b.goldPrices.price999 || Infinity);
      
      if (aMinPrice !== bMinPrice) {
        return aMinPrice - bMinPrice;
      }
      
      // If prices are equal, sort by distance (if user location available)
      if (userLocation) {
        const distanceA = Math.sqrt(
          Math.pow(a.latitude - userLocation.latitude, 2) + 
          Math.pow(a.longitude - userLocation.longitude, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(b.latitude - userLocation.latitude, 2) + 
          Math.pow(b.longitude - userLocation.longitude, 2)
        );
        return distanceA - distanceB;
      }
      
      return 0;
    });
  };

  useEffect(() => {
    const generatedShops = generateShops();
    setShops(generatedShops);
    
    // Extract unique shop names for search suggestions
    const uniqueShopNames = [...new Set(generatedShops.map(shop => shop.name))].sort();
    setShopNames(uniqueShopNames);
    
    // Initial load: sort by lowest gold price then by nearest distance
    const sortedShops = sortByPriceThenDistance(generatedShops);
    setFilteredShops(sortedShops.slice(0, displayedShops));
    setTotalResults(generatedShops.length);

    // Find best prices
    const sorted916 = [...generatedShops].sort((a, b) => a.goldPrices.price916 - b.goldPrices.price916);
    const sorted999 = [...generatedShops].sort((a, b) => a.goldPrices.price999 - b.goldPrices.price999);
    
    setBestPrices({
      best916: sorted916[0],
      best999: sorted999[0]
    });
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

    // Apply gold type filter (only if filters are shown)
    if (showFilters && selectedGoldType !== 'all') {
      if (selectedGoldType === '916') {
        filtered = filtered.filter(shop => shop.goldPrices.price916 > 0);
      } else if (selectedGoldType === '999') {
        filtered = filtered.filter(shop => shop.goldPrices.price999 > 0);
      }
    }

    // Apply sorting
    if (isNearbyMode && userLocation) {
      // Sort by distance when in nearby mode
      filtered = sortShopsByDistance(filtered, userLocation.latitude, userLocation.longitude);
    } else if (sortBy === 'price-distance') {
      // Sort by price then distance (default behavior)
      filtered = sortByPriceThenDistance(filtered);
    } else {
      // Apply other sorting options
      switch (sortBy) {
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
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
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
    
    // Show More/Less logic: hide if results ≤ 8
    setShowMoreVisible(filtered.length > 8 && filtered.length > displayedShops);
  }, [searchTerm, searchType, selectedGoldType, sortBy, shops, hasSearched, displayedShops, isNearbyMode, userLocation, showFilters]);

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
      setShowFilters(true);
      // Apply price-distance sorting after search
      setSortBy('price-distance');
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
      // Reset to default price-distance view
      setHasSearched(false);
      setShowFilters(false);
      setSelectedGoldType('all');
      setSortBy('price-distance');
      setDisplayedShops(8);
    } else {
      // If Nearby Me is active, re-trigger previous nearby search
      setHasSearched(true);
      setShowFilters(true);
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setHasSearched(false);
    setShowFilters(false);
    setSelectedGoldType('all');
    setSortBy('price-distance');
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
    setSortBy('price-distance');
  };

  // Handle nearby me button
  const handleNearbyMe = async () => {
    try {
      if (isNearbyMode) {
        // Deactivate nearby mode
        toggleNearbyMode();
        setSearchTerm('');
        setHasSearched(false);
        setShowFilters(false);
        setSelectedGoldType('all');
        setSortBy('price-distance');
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
            setShowFilters(true);
            setDisplayedShops(8);
          } else {
            // Use default coordinates for unknown location
            setManualLocation(1.3521, 103.8198);
            setSearchTerm(location);
            setHasSearched(true);
            setShowFilters(true);
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
        title: "Gold Shops Across Singapore",
        subtitle: `${totalResults} shops sorted by lowest price and nearest distance`
      };
    } else if (hasSearched && searchTerm.trim()) {
      return {
        title: `Gold Shops Across "${searchTerm}"`,
        subtitle: `${totalResults} shops found`
      };
    } else {
      return {
        title: "Gold Shops Across Singapore",
        subtitle: `${totalResults} shops sorted by lowest price and nearest distance`
      };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <GoldDecorations />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
              Find the Best
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 block">
                Gold Prices
              </span>
              in Singapore
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Compare real-time gold prices from premium jewelry shops across Singapore. 
              Find the best deals on 916 and 999 gold with live updates.
            </p>
          </div>

          {/* Best Price Cards */}
          {bestPrices.best916 && bestPrices.best999 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <BestPriceCard
                shop={bestPrices.best916}
                goldType="916 Gold"
                price={bestPrices.best916.goldPrices.price916}
                label="Lowest 916 Gold Price"
              />
              <BestPriceCard
                shop={bestPrices.best999}
                goldType="999 Gold"
                price={bestPrices.best999.goldPrices.price999}
                label="Lowest 999 Gold Price"
              />
            </div>
          )}

          {/* Search Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 font-serif">Search & Compare</h2>
              <p className="text-gray-400">Search and Compare to find the best gold prices in your area.</p>
            </div>

            {/* Search Toggle and Nearby Me */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <div className="bg-gray-800 p-1 rounded-lg">
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

            {/* Filter Bar - Only show after search */}
            {showFilters && (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Gold Type Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGoldType('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedGoldType === 'all'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedGoldType('916')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedGoldType === '916'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    916 Gold
                  </button>
                  <button
                    onClick={() => setSelectedGoldType('999')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedGoldType === '999'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    999 Gold
                  </button>
                </div>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="price-distance">Best Price & Distance</option>
                  <option value="name">A-Z</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="rating-high">Rating High to Low</option>
                  <option value="rating-low">Rating Low to High</option>
                  <option value="distance-near">Nearest First</option>
                  <option value="distance-far">Farthest First</option>
                </select>

                {/* Reset Filters Button */}
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center">
              <p className="text-gray-400">
                {totalResults} {totalResults === 1 ? 'shop' : 'shops'} found
              </p>
            </div>
          </div>

          {/* Featured Shops */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-serif">{headerContent.title}</h2>
              <p className="text-gray-400">{headerContent.subtitle}</p>
            </div>

            {filteredShops.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {filteredShops.map(shop => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>

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
            ) : hasSearched ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No gold shops found</h3>
                <p className="text-gray-400">No gold shops found for '{searchTerm}'</p>
              </div>
            ) : null}
          </div>

          {/* Visitor Analytics */}
          <VisitorAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Home;