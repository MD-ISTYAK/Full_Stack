import singaporeShopsData from './singapore_gold_shops.json';
import shopReviewsData from './shop_reviews.json';

// Static image paths
const PROFILE_IMAGE = '/shop_profile.jpg';
const GALLERY_IMAGE = '/Gold_shop_sample_image.jpg';
const MAP_IMAGE = '/map_location.jpg';

// Singapore districts for organization
export const districts = [
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Boon Lay', 'Bukit Batok', 'Bukit Merah', 
  'Bukit Panjang', 'Bukit Timah', 'Central Water Catchment', 'Changi', 
  'Choa Chu Kang', 'Clementi', 'Downtown Core', 'Geylang', 'Hougang', 
  'Jurong East', 'Jurong West', 'Kallang', 'Marine Parade', 'Marina East', 
  'Marina South', 'Museum', 'Newton', 'North-Eastern Islands', 'Novena', 
  'Orchard', 'Outram', 'Pasir Ris', 'Punggol', 'Queenstown', 'River Valley',
  'Rochor', 'Sembawang', 'Sengkang', 'Serangoon', 'Singapore River', 
  'Southern Islands', 'Tampines', 'Tanglin', 'Toa Payoh', 'Woodlands', 'Yishun'
];

// Approximate coordinates for Singapore districts (center points)
const districtCoordinates = {
  'Ang Mo Kio': { lat: 1.3691, lng: 103.8454 },
  'Bedok': { lat: 1.3240, lng: 103.9300 },
  'Bishan': { lat: 1.3521, lng: 103.8198 },
  'Boon Lay': { lat: 1.3388, lng: 103.7054 },
  'Bukit Batok': { lat: 1.3483, lng: 103.7631 },
  'Bukit Merah': { lat: 1.2810, lng: 103.8198 },
  'Bukit Panjang': { lat: 1.3774, lng: 103.7747 },
  'Bukit Timah': { lat: 1.3257, lng: 103.8160 },
  'Central Water Catchment': { lat: 1.3700, lng: 103.8000 },
  'Changi': { lat: 1.3571, lng: 103.9870 },
  'Choa Chu Kang': { lat: 1.3850, lng: 103.7440 },
  'Clementi': { lat: 1.3150, lng: 103.7640 },
  'Downtown Core': { lat: 1.2800, lng: 103.8500 },
  'Geylang': { lat: 1.3187, lng: 103.8840 },
  'Hougang': { lat: 1.3711, lng: 103.8920 },
  'Jurong East': { lat: 1.3333, lng: 103.7420 },
  'Jurong West': { lat: 1.3400, lng: 103.7000 },
  'Kallang': { lat: 1.3110, lng: 103.8710 },
  'Marine Parade': { lat: 1.3020, lng: 103.9000 },
  'Marina East': { lat: 1.2800, lng: 103.8700 },
  'Marina South': { lat: 1.2800, lng: 103.8500 },
  'Museum': { lat: 1.3000, lng: 103.8500 },
  'Newton': { lat: 1.3120, lng: 103.8400 },
  'North-Eastern Islands': { lat: 1.4000, lng: 103.9500 },
  'Novena': { lat: 1.3200, lng: 103.8400 },
  'Orchard': { lat: 1.3000, lng: 103.8400 },
  'Outram': { lat: 1.2800, lng: 103.8300 },
  'Pasir Ris': { lat: 1.3720, lng: 103.9490 },
  'Punggol': { lat: 1.3980, lng: 103.9070 },
  'Queenstown': { lat: 1.3000, lng: 103.8000 },
  'River Valley': { lat: 1.2900, lng: 103.8300 },
  'Rochor': { lat: 1.3000, lng: 103.8500 },
  'Sembawang': { lat: 1.4490, lng: 103.8200 },
  'Sengkang': { lat: 1.3840, lng: 103.8950 },
  'Serangoon': { lat: 1.3500, lng: 103.8700 },
  'Singapore River': { lat: 1.2900, lng: 103.8500 },
  'Southern Islands': { lat: 1.2500, lng: 103.8300 },
  'Tampines': { lat: 1.3520, lng: 103.9440 },
  'Tanglin': { lat: 1.3000, lng: 103.8200 },
  'Toa Payoh': { lat: 1.3320, lng: 103.8500 },
  'Woodlands': { lat: 1.4360, lng: 103.7860 },
  'Yishun': { lat: 1.4290, lng: 103.8350 }
};

// Function to get random reviews for a shop
const getRandomReviews = (shopId) => {
  const shuffled = [...shopReviewsData].sort(() => 0.5 - Math.random());
  const numReviews = Math.floor(Math.random() * 6) + 5; // 5-10 reviews per shop
  return shuffled.slice(0, numReviews).map((review, index) => ({
    id: `${shopId}-${index}`,
    username: review.user_name,
    rating: review.rating,
    comment: review.feedback,
    date: `${Math.floor(1 + Math.random() * 30)} days ago`
  }));
};

// Function to generate random coordinates within a district
const generateRandomCoordinates = (district) => {
  const baseCoords = districtCoordinates[district];
  if (!baseCoords) return { lat: 1.3521, lng: 103.8198 }; // Default to Singapore center
  
  // Add some random variation (±0.01 degrees, roughly ±1km)
  const latVariation = (Math.random() - 0.5) * 0.02;
  const lngVariation = (Math.random() - 0.5) * 0.02;
  
  return {
    lat: baseCoords.lat + latVariation,
    lng: baseCoords.lng + lngVariation
  };
};

// Function to generate shops from JSON data
export const generateShops = () => {
  const shops = [];
  let shopId = 1;

  // Process each district and create 10 shops per district
  districts.forEach(district => {
    // Filter shops for this district from JSON data
    const districtShops = singaporeShopsData.filter(shop => 
      shop.district === district
    ).slice(0, 10); // Take only 10 shops per district

    districtShops.forEach(shopData => {
      const coordinates = generateRandomCoordinates(district);
      
      const shop = {
        id: shopId++,
        name: shopData.shop_name,
        about: shopData.about,
        district: shopData.district,
        address: shopData.shop_address,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5-5.0
        distance: parseFloat(shopData.distance_km),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        phone: `+65 ${Math.floor(6000 + Math.random() * 3000)} ${Math.floor(1000 + Math.random() * 8999)}`,
        hours: '9:00 AM - 8:00 PM',
        profileImage: PROFILE_IMAGE,
        galleryImages: [GALLERY_IMAGE, GALLERY_IMAGE, GALLERY_IMAGE, GALLERY_IMAGE],
        mapImage: MAP_IMAGE,
        goldPrices: {
          price916: parseFloat(shopData.gold_price_916),
          price999: parseFloat(shopData.gold_price_999),
          lastUpdated: `${Math.floor(2 + Math.random() * 13)} minutes ago`,
          updatedBy: Math.random() > 0.5 ? 'Shop Owner' : 'Shop Manager'
        },
        reviews: getRandomReviews(shopId - 1)
      };
      
      shops.push(shop);
    });
  });

  return shops;
};

// Visitor statistics
export const visitorStats = {
  today: 1203,
  yesterday: 1074,
  week: 8456,
  month: 32890,
  allTime: 1247890
};

// Chart data for analytics
export const chartData = [
  { name: 'Mon', visitors: 850 },
  { name: 'Tue', visitors: 920 },
  { name: 'Wed', visitors: 1100 },
  { name: 'Thu', visitors: 980 },
  { name: 'Fri', visitors: 1350 },
  { name: 'Sat', visitors: 1620 },
  { name: 'Sun', visitors: 1203 }
];