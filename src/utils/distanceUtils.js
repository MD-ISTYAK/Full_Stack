// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Sort shops by distance from user location
export const sortShopsByDistance = (shops, userLat, userLon) => {
  return [...shops].sort((a, b) => {
    const distanceA = calculateDistance(userLat, userLon, a.latitude || 0, a.longitude || 0);
    const distanceB = calculateDistance(userLat, userLon, b.latitude || 0, b.longitude || 0);
    return distanceA - distanceB;
  });
};

// Get shops within a certain radius (in km)
export const getShopsWithinRadius = (shops, userLat, userLon, radiusKm = 10) => {
  return shops.filter(shop => {
    const distance = calculateDistance(userLat, userLon, shop.latitude || 0, shop.longitude || 0);
    return distance <= radiusKm;
  });
}; 