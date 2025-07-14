import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [locationPermission, setLocationPermission] = useState('prompt');

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedNearbyMode = localStorage.getItem('isNearbyMode');
    
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
    
    if (savedNearbyMode) {
      setIsNearbyMode(JSON.parse(savedNearbyMode));
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }
    localStorage.setItem('isNearbyMode', JSON.stringify(isNearbyMode));
  }, [userLocation, isNearbyMode]);

  const getCurrentLocation = async () => {
    try {
      setLocationPermission('requesting');
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now()
      };

      setUserLocation(location);
      setLocationPermission('granted');
      setIsNearbyMode(true);
      
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission('denied');
      throw error;
    }
  };

  const setManualLocation = (latitude, longitude) => {
    const location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: Date.now()
    };
    setUserLocation(location);
    setIsNearbyMode(true);
  };

  const clearLocation = () => {
    setUserLocation(null);
    setIsNearbyMode(false);
    localStorage.removeItem('userLocation');
    localStorage.removeItem('isNearbyMode');
  };

  const toggleNearbyMode = () => {
    if (isNearbyMode) {
      clearLocation();
    } else {
      getCurrentLocation();
    }
  };

  const value = {
    userLocation,
    isNearbyMode,
    locationPermission,
    getCurrentLocation,
    setManualLocation,
    clearLocation,
    toggleNearbyMode,
    setIsNearbyMode
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 