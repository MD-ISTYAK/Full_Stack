import indiaShopsData from './india_gold_shops.json';
import shopReviewsData from './shop_reviews.json';
import states from '../states.json';

// Static image paths
const PROFILE_IMAGE = '/shop_profile.jpg';
const GALLERY_IMAGE = '/Gold_shop_sample_image.jpg';

// List of Indian states
export const stateList = states.map(s => s.state);

// Function to generate shops from JSON data
export const generateShops = () => {
  const shops = [];
  let shopId = 1;

  indiaShopsData.forEach(shopData => {
    const shop = {
      id: shopId++,
      name: shopData["Shop / Retail Chain"] || shopData.shop_name || "Gold Shop #" + shopId,
      about: shopData.about || "Premium gold retailer in India.",
      state: shopData["Location"] || shopData.state || stateList[(shopId-1) % stateList.length] || "Unknown State",
      address: shopData["Address"] || shopData.address || "123 Main Road, India",
      rating: shopData["Rating"] || shopData.rating || parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      distance: shopData.distance_km || parseFloat((1 + Math.random() * 9).toFixed(2)),
      phone: shopData.phone || '+91-99999-00000',
      hours: '9:00 AM - 8:00 PM',
      profileImage: PROFILE_IMAGE,
      galleryImages: [GALLERY_IMAGE, GALLERY_IMAGE, GALLERY_IMAGE, GALLERY_IMAGE],
      goldPrices: {
        price916: shopData["22-Carat (1g)"] || shopData.gold_price_916 || 9000 + Math.floor(Math.random() * 500),
        price999: shopData["24-Carat (1g)"] || shopData.gold_price_999 || 9800 + Math.floor(Math.random() * 500),
        price22K: shopData["22-Carat (1g)"] || shopData.gold_price_916 || 9000 + Math.floor(Math.random() * 500),
        price24K: shopData["24-Carat (1g)"] || shopData.gold_price_999 || 9800 + Math.floor(Math.random() * 500),
        lastUpdated: `${Math.floor(2 + Math.random() * 13)} minutes ago`,
        updatedBy: Math.random() > 0.5 ? 'Shop Owner' : 'Shop Manager'
      },
      reviews: getRandomReviews(shopId - 1)
    };
    shops.push(shop);
  });

  return shops;
};

// Helper to get random reviews for a shop
function getRandomReviews(shopId) {
  if (!shopReviewsData || !Array.isArray(shopReviewsData)) return [];
  // Just return 2-4 random reviews for demo
  const reviews = [...shopReviewsData].sort(() => 0.5 - Math.random());
  return reviews.slice(0, Math.floor(2 + Math.random() * 3));
}

export const visitorStats = {
  totalVisitors: 12345,
  today: 123,
  yesterday: 110,
  week: 800,
  month: 3200,
  allTime: 45678,
  trendingState: "Tamil Nadu",
  trendingShop: "Kalyan Jewellers",
  mostSearchedGoldType: "916",
  lastUpdated: "just now"
}; 